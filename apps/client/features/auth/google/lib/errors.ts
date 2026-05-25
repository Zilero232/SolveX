export class GoogleSignInCancelled extends Error {
  constructor() {
    super('Google sign-in was cancelled');
    this.name = 'GoogleSignInCancelled';
  }
}
