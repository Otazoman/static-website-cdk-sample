import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { WebsiteProperty } from "../parameter/index";
import { CertificateConstruct } from "./construct/certificate-construct";
import { HostedZoneConstruct } from "./construct/hosted-zone-construct";

export interface HostedZoneAcmStackProps
  extends cdk.StackProps,
    WebsiteProperty {}

export interface HostedZoneInfo {
  hostedZoneId: string;
  zoneName: string;
}

export class HostedZoneAcmStack extends cdk.Stack {
  public readonly certificateArn: string;
  public readonly hostedZone: HostedZoneInfo | undefined;

  constructor(scope: Construct, id: string, props: HostedZoneAcmStackProps) {
    super(scope, id, props);

    // Public Hosted Zone
    const hostedZoneConstruct = props.hostedZone
      ? new HostedZoneConstruct(this, "HostedZoneConstruct", {
          ...props.hostedZone,
        })
      : undefined;

    // ACM Certificate
    const certificateConstruct = props.certificate
      ? new CertificateConstruct(this, "CertificateConstruct", {
          ...props.certificate,
          hostedZoneConstruct,
        })
      : undefined;
    // for Cross Region
    this.certificateArn =
      certificateConstruct?.certificate.certificateArn || "";
    this.hostedZone = hostedZoneConstruct
      ? {
          hostedZoneId: hostedZoneConstruct?.hostedZone.hostedZoneId,
          zoneName: hostedZoneConstruct?.hostedZone.zoneName,
        }
      : undefined;
  }
}
