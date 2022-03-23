import 'reflect-metadata';
import App from './app';

const main = async () => {
  const app = new App();
  await app.start();
};

main();
