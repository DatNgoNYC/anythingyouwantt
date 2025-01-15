import 'express';

declare module 'express-serve-static-core' {
  interface Locals {
    userId: string; // Add userId to res.locals, guranteed by 'auth' middleware
  }
}
