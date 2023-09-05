#!/usr/bin/env bash

# Create AWS CFN Stack - wrapper for `aws cloudformation create-stack`

usage="Usage: $(basename "$0") region stack-name

where:
    region      - the AWS region
    stack-name  - the stack name
"

if [ -z "$1" ] || [ -z "$2" ] ; then
  echo "$usage"
  exit -1
fi

# STACK_NAME="dynamodb-mr"
TEMPLATE_FILE="resources/usersTable.yml"

echo "Checking if stack exists ..."

if ! aws cloudformation describe-stacks --region $1 --stack-name $2 ; then

    echo -e "\nStack does not exist, creating ..."
    aws cloudformation create-stack --region $1 --stack-name $2 --template-body file://$TEMPLATE_FILE

    echo "Waiting for stack to be created ..."
    aws cloudformation wait stack-create-complete --region $1 --stack-name $2

else 
    echo -e "\nStack exists, attempting update ..."

    set +e
    update_output=$( aws cloudformation update-stack --region $1 --stack-name $2 --template-body file://$TEMPLATE_FILE 2>&1)
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