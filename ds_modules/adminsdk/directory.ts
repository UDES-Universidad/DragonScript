/**
 * Admin SDK
 * */

interface ConfAllUsers {
  domain?: string;
  orderBy?: string;
  maxResults?: number;
}

interface ConfAddUser {
  primaryEmail: string;
  name: {
    givenName: string;
    familyName: string;
  };
}

class AdminSDK {
  /**
   * Get a user by email.
   * */
  public getUserByEmail(email: string) {
    return AdminDirectory.Users?.get(email);
  }

  /**
   * Update user.
   * */
  public updateUser(user: { [keys: string]: string }) {
    AdminDirectory.Users?.update(user, user.primaryEmail);
  }

  /**
   * List all users.
   * */
  public allUsers(conf: ConfAllUsers) {
    let pageToken;
    let page;
    do {
      page = AdminDirectory.Users?.list({
        ...conf,
        pageToken,
      });
      const users = page?.users;
      if (users) {
        for (const user of users) {
          Logger.log(user);
        }
      } else {
        Logger.log('No users found');
      }
      pageToken = page?.nextPageToken;
    } while (pageToken);
  }

  /**
   * adduser
   */
  public addUser(conf: ConfAddUser) {}
}

/**
 * Client
 * */
class AdminsdkClient {
  public static create() {
    return new AdminSDK();
  }
}

export default AdminsdkClient;
