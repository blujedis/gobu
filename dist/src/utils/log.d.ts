declare const log: import("kricket").Logger<"error" | "info" | "fatal" | "warn" | "debug" | "alert" | "caution" | "notice" | "success"> & Record<"error" | "info" | "fatal" | "warn" | "debug" | "alert" | "caution" | "notice" | "success", import("kricket").LogMethod<import("kricket").Logger<"error" | "info" | "fatal" | "warn" | "debug" | "alert" | "caution" | "notice" | "success">>>;
declare const catchError: (err: Error) => void;
export { log, catchError };
