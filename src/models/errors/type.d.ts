export type TErrorsEntityProps = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>
export type TErrorProps = {
  message?: string
  status?: number
}
