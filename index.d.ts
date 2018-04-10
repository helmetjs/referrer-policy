import * as http from "http";

interface IReferrerPolicyOptions {
  policy?:
    "no-referrer" |
    "no-referrer-when-downgrade" |
    "same-origin" |
    "origin" |
    "strict-origin" |
    "origin-when-cross-origin" |
    "strict-origin-when-cross-origin" |
    "unsafe-url" |
    "";
}

interface NextFunction {
  (err?: any): void;
}

declare function referrerPolicy(options?: IReferrerPolicyOptions):
  (req: http.IncomingMessage, res: http.ServerResponse, next: NextFunction) => void;

export = referrerPolicy;
