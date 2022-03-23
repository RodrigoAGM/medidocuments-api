import mongoose from 'mongoose';

class MongooseManager {
  private static _instance: MongooseManager

  async connect() {
    try {
      const dbUrl = process.env.DB_URL;

      if (dbUrl === undefined) {
        return Promise.reject(new Error('No database connection url was provided on .env file'));
      }

      await mongoose.connect(dbUrl);

      return Promise.resolve('Database connected!');
    } catch (error) {
      console.log(error);
      return Promise.reject(new Error('Error connecting to database'));
    }
  }

  public static get Instance() {
    // eslint-disable-next-line no-return-assign
    return this._instance || (this._instance = new this());
  }
}

export const manager = MongooseManager.Instance;
