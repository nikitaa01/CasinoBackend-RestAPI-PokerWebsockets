type Response<T> = Promise<{
    ok: false;
} | {
    ok: true;
    data: T;
}>;
export default Response;
