class AppError extends Error {
    resMessage;
    status;
    data;
    originalErr;

    constructor(err, resMessage = "Não foi possível concluir a operação", config = null) {
        const message = err.message
            || config.message
            || "Internal Server Error";

        super(message);

        this.resMessage = resMessage;
        this.data = !!config ? config.data : null;
        this.status = !!config ? config.status : 500;
        this.originalErr = err;
    }
}

export default AppError;
