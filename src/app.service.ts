import { Injectable } from '@nestjs/common';
import * as AWS from "aws-sdk";

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
