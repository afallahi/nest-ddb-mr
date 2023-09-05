import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import User from "./interface";

const usersTableName = "UsersTable";

const dynamoDB = process.env.IS_OFFLINE
  ? new AWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: process.env.DYNAMODB_ENDPOINT,
    })
  : new AWS.DynamoDB.DocumentClient();

console.log(dynamoDB)

@Injectable()
export class AppService {
  async getUsers(): Promise<any> {
    try {
      return dynamoDB
        .scan({
          TableName: usersTableName, //process.env.USERS_TABLE_NAME, // "UsersTable",
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async createUser(user: User): Promise<any> {
    const userObj = {
      id: uuid(),
      ...user,
    };
    try {
      return await dynamoDB
        .put({
          TableName: usersTableName,
          Item: userObj,
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getUserById(id: string): Promise<any> {
    try {
      return await dynamoDB
        .get({
          TableName:  usersTableName, //process.env.USERS_TABLE_NAME,
          Key: { id },
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      return await dynamoDB
        .delete({
          TableName: usersTableName,
          Key: {
            id: id,
          },
        })
        .promise();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
