import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CloudfrontS3Stack } from "../lib/cloudfront-s3-stack";
import { HostedZoneAcmStack } from "../lib/hostedzone-acm-stack";
import { websiteStackProperty } from "../parameter/index";

describe("Stack Snapshot Tests", () => {
  test("HostedZoneAcmStack snapshot test", () => {
    const app = new cdk.App();
    const envACM = {
      account: websiteStackProperty.env?.account,
      region: "us-east-1",
    };

    const acmstack = new HostedZoneAcmStack(app, "HostedZoneAcmStack", {
      env: envACM,
      ...websiteStackProperty.props,
    });

    const template = Template.fromStack(acmstack);
    expect(template.toJSON()).toMatchSnapshot();
  });

  test("CloudfrontS3Stack snapshot test", () => {
    const app = new cdk.App();
    const acmstack = new HostedZoneAcmStack(app, "HostedZoneAcmStack", {
      env: websiteStackProperty.env,
      ...websiteStackProperty.props,
    });

    const staticsitestack = new CloudfrontS3Stack(app, "CloudfrontS3Stack", {
      env: websiteStackProperty.env,
      ...websiteStackProperty.props,
      certificateArn: acmstack.certificateArn,
      hostedZoneInfo: acmstack.hostedZone,
    });
    staticsitestack.addDependency(acmstack);

    const template = Template.fromStack(staticsitestack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
