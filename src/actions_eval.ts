import _vscode from "vscode";

const vscode = _vscode;

// Ensure that the globals are 'used' so that they are not removed at build time
// and linters do not complain about them.
void vscode;

/**
 * Execute javascript code passed from lua in an async function context
 *
 * - the variable `vscode` can be used to access the VSCode API
 * - the variable `args` can be used to access the arguments passed from lua
 *
 * @param code the code to evaluate
 * @param args arguments passed from lua
 *
 * @returns the result of evaluating the code, serialized to send back to lua
 */
export async function eval_for_client(code: string, args: any): Promise<any> {
    void args;

    const func: () => Promise<any> = eval("async () => {" + code + "}");
    const result = await func();

    let data: string | undefined;
    try {
        data = JSON.stringify(result);
    } catch (e) {
        throw new Error(`Return value of eval not JSON serializable: ${e}`);
    }

    return data ? JSON.parse(data) : data;
}
