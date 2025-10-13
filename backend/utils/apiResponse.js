class apiResponse
{
    constructor
    (
        statusCode,
        data,
        message = "Success~!!"
    )
    {
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode<400
    }
    Json() {
        return {
            success: this.success,
            statusCode: this.statusCode,
            data: this.data,
            message: this.message
        }
    }
}
export default apiResponse;