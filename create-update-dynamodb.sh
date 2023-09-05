#!/usr/bin/env bash

# Create AWS CFN Stack - wrapper for `aws cloudformation create-stack`

usage="Usage: $(basename "$0") region stack-name table-name

where:
    region      - the AWS region
    stack-name  - the stack name
    table-name  - the table name
"

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] ; then
  echo "$usage"
  exit -1
fi

# STACK_NAME="dynamodb-mr" or "dynamodb-gt-mr"
# TEMPLATE_FILE="usersTable.yml"  or "usersGlobalTable.yml" 
template_file="file://resources/$3"

echo "Checking if stack exists ..."

if ! aws cloudformation describe-stacks --region $1 --stack-name $2 ; then

    echo -e "\nStack does not exist, creating ..."
    aws cloudformation create-stack --region $1 --stack-name $2 --template-body $template_file

    echo "Waiting for stack to be created ..."
    aws cloudformation wait stack-create-complete --region $1 --stack-name $2

else 
    echo -e "\nStack exists, attempting update ..."

    set +e
    update_output=$( aws cloudformation update-stack --region $1 --stack-name $2 --template-body $template_file 2>&1)
    status=$?
    set -e

    # echo "$update_output"

    if [ $status -ne 0 ] ; then

        # Don't fail when no update needed
        if [[ $update_output == *"ValidationError"* && $update_output == *"No updates"* ]] ; then
            echo -e "\nFinished create/update - no updates to be performed"
            exit 0
        else
            exit $status
        fi

    fi

    echo "Waiting for stack update to complete ..."
    
    aws cloudformation wait stack-update-complete --region $1 --stack-name $2

fi

echo "Finished create/update successfully!"