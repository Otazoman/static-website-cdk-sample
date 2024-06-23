import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { WebsiteProperty } from "../parameter/index";
import { BucketConstruct } from "./construct/bucket-construct";
import { ContentsDeliveryConstruct } from "./construct/contents-delivery-construct";
import { LogAnalyticsConstruct } from "./construct/log-analytics-construct";
import { HostedZoneInfo } from "./hostedzone-acm-stack";

export interface CloudfrontS3StackProps
  extends cdk.StackProps,
    WebsiteProperty {
  certificateArn?: string;
  hostedZoneInfo?: HostedZoneInfo;
}

export class CloudfrontS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CloudfrontS3StackProps) {
    super(scope, id, props);

    // HostedZone import
    const hostedZoneinfo = props.hostedZoneInfo;
    const hostedZone = hostedZoneinfo
      ? cdk.aws_route53.HostedZone.fromHostedZoneAttributes(
          this,
          "ImportedHostedZone",
          {
            hostedZoneId: hostedZoneinfo.hostedZoneId,
            zoneName: hostedZoneinfo.zoneName,
          }
        )
      : undefined;

    // ACM import
    const certificateArn = props.certificateArn;
    const certificate = certificateArn
      ? cdk.aws_certificatemanager.Certificate.fromCertificateArn(
          this,
          "ImportedCertificate",
          certificateArn
        )
      : undefined;

    // Bucket for S3 Server Access Log
    const s3serverAccessLogBucketConstruct = props.s3ServerAccessLog
      ?.enableAccessLog
      ? new BucketConstruct(this, "S3ServerAccessLogBucketConstruct", {
          allowDeleteBucketAndObjects: props.allowDeleteBucketAndObjects,
          accessControl: cdk.aws_s3.BucketAccessControl.LOG_DELIVERY_WRITE,
          ...props.s3ServerAccessLog,
        })
      : undefined;

    // Bucket for CloudFront Access Log
    const cloudFrontAccessLogBucketConstruct = props.cloudFrontAccessLog
      ?.enableAccessLog
      ? new BucketConstruct(this, "CloudFrontAccessLogBucketConstruct", {
          allowDeleteBucketAndObjects: props.allowDeleteBucketAndObjects,
          accessControl: cdk.aws_s3.BucketAccessControl.LOG_DELIVERY_WRITE,
          ...props.cloudFrontAccessLog,
        })
      : undefined;

    // Bucket for Website contents
    const websiteBucketConstruct = new BucketConstruct(
      this,
      "WebsiteBucketConstruct",
      {
        s3ServerAccessLogBucketConstruct: s3serverAccessLogBucketConstruct,
        allowDeleteBucketAndObjects: props.allowDeleteBucketAndObjects,
        logFilePrefix: props.s3ServerAccessLog?.logFilePrefix,
      }
    );

    // CloudFront
    const contentsDeliveryConstruct = new ContentsDeliveryConstruct(
      this,
      "ContentsDeliveryConstruct",
      {
        websiteBucketConstruct: websiteBucketConstruct,
        cloudFrontAccessLogBucketConstruct,
        hostedZone: hostedZone,
        certificate: certificate,
        ...props.contentsDelivery,
        ...props.cloudFrontAccessLog,
        ...props.logAnalytics,
      }
    );

    // Log Analytics
    // Athena query output
    const queryOutputBucketConstruct = props.logAnalytics?.createWorkGroup
      ? new BucketConstruct(this, "QueryOutputBucketConstruct", {
          allowDeleteBucketAndObjects: props.allowDeleteBucketAndObjects,
        })
      : undefined;

    const logAnalyticsConstruct = props.logAnalytics
      ? new LogAnalyticsConstruct(this, "LogAnalyticsConstruct", {
          queryOutputBucketConstruct,
        })
      : undefined;

    // Database
    if (!logAnalyticsConstruct) {
      return;
    }
    const database = props.logAnalytics?.enableLogAnalytics
      ? logAnalyticsConstruct?.createDatabase("AccessLogDatabase", {
          databaseName: "access_log",
        })
      : undefined;

    // S3 Server Access Log Table
    if (s3serverAccessLogBucketConstruct) {
      database
        ? logAnalyticsConstruct?.createTable("S3ServerAccessLogTable", {
            databaseName: database.ref,
            logType: "s3ServerAccessLog",
            locationPlaceHolder: {
              logBucketName: s3serverAccessLogBucketConstruct.bucket.bucketName,
              logSrcResourceId: websiteBucketConstruct.bucket.bucketName,
              logSrcResourceAccountId: this.account,
              logSrcResourceRegion: this.region,
              prefix: props.s3ServerAccessLog?.logFilePrefix,
            },
          })
        : undefined;
    }

    // CloudFront Access Log Table
    if (cloudFrontAccessLogBucketConstruct) {
      database
        ? logAnalyticsConstruct?.createTable("CloudFrontAccessLogTable", {
            databaseName: database.ref,
            logType: "cloudFrontAccessLog",
            locationPlaceHolder: {
              logBucketName:
                cloudFrontAccessLogBucketConstruct.bucket.bucketName,
              logSrcResourceId:
                contentsDeliveryConstruct.distribution.distributionId,
              logSrcResourceAccountId: this.account,
              logSrcResourceRegion: this.region,
              prefix: props.cloudFrontAccessLog?.logFilePrefix,
            },
          })
        : undefined;
    }
  }
}
