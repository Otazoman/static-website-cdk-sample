#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { CloudfrontS3Stack } from "../lib/cloudfront-s3-stack";
import { HostedZoneAcmStack } from "../lib/hostedzone-acm-stack";
import { websiteStackProperty } from "../parameter/index";

const app = new cdk.App();

const envACM = {
  account: websiteStackProperty.env?.account,
  region: "us-east-1",
};

const acmstack = new HostedZoneAcmStack(app, "HostedZoneAcmStack", {
  env: envACM,
  crossRegionReferences: true,
  ...websiteStackProperty.props,
});

const staticsitestack = new CloudfrontS3Stack(app, "CloudfrontS3Stack", {
  env: websiteStackProperty.env,
  crossRegionReferences: true,
  ...websiteStackProperty.props,
  certificateArn: acmstack.certificateArn,
  hostedZoneInfo: acmstack.hostedZone,
});

staticsitestack.addDependency(acmstack);
app.synth();
