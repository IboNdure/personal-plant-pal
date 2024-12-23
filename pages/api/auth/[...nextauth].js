import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "username: shark",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password: shark",
        },
      },
      async authorize(credentials) {
        if (
          credentials.username === "shark" &&
          credentials.password === "shark"
        ) {
          return {
            name: "Neuer Shark",
            email: "test@example.com",
            id: "a1b2c3d4",
          };
        } else {
          throw new Error("Invalid username or password");
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
