import { exec, spawn } from "child_process";

import { commandSchema } from "~/schemas/command-schema";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const execPromise = (cmd: string): Promise<string> => {
  return new Promise(function (resolve, reject) {
    exec(cmd, function (err, stdout, stderr) {
      if (err) return reject(err);
      resolve(stdout ?? stderr);
    });
  });
};

const cmd = (command: string, params: string[]): Promise<string> => {
  const childProcess = spawn(command, params);
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";

    // read from streams
    childProcess.stdout.on("data", (x) => {
      stdout += x.toString();
    });
    childProcess.stderr.on("data", (x) => {
      stderr += x.toString();
    });

    // if stream exited, resolve or reject promise
    childProcess.on("exit", (exitCode) => {
      console.log(`exited child process with code ${exitCode ?? "unknown"}`);
      if (exitCode === 0) {
        resolve(stdout);
      } else {
        reject(stderr);
      }
    });
  });
};

export const commandRouter = createTRPCRouter({
  ipConfig: publicProcedure.input(commandSchema).mutation(async ({ input }) => {
    console.log(`Executing command ${input.command}...`);

    return await executeCommand(
      input.command,
      input.parameters ? [input.parameters] : [],
      input.useSanetization
    );
  }),
});

const executeCommand = async (
  command: string,
  params: string[],
  useSpawn: boolean
): Promise<string> => {
  if (useSpawn) {
    return await cmd(command, params);
  }

  const unsecureCommand = command + ' ' + params.join(" ");
  console.warn(`executing unsecure command '${unsecureCommand}'...`);
  return await execPromise(unsecureCommand);
};
