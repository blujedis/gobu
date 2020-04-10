declare const log: import("kricket").Logger<"fatal" | "error" | "warn" | "info" | "debug" | "alert" | "caution" | "notice" | "success"> & Record<"fatal" | "error" | "warn" | "info" | "debug" | "alert" | "caution" | "notice" | "success", import("kricket").LogMethod<import("kricket").Logger<"fatal" | "error" | "warn" | "info" | "debug" | "alert" | "caution" | "notice" | "success">>>;
declare const catchError: (err: Error) => void;
export { log, catchError };
