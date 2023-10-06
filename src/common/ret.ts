export class Ret {

    private message: string;

    private success: boolean;

    private error: string;

    private data: any ;

    private static res = new Ret()


    static ok(data?: any, message?: string) {
        this.res.success = true;
        this.res.data = data;
        this.res.message = message || '';
        return this.res;
    }

    static fail(err: string){
        this.res.success = false;
        this.res.error = err
        return this.res;
    }
}