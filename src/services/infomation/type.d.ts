export type TCreateInformationPayload = {
  category_id: string
  attributes: {}
}

export type TUpdateInformationPayload = TCreateInformationPayload & {
  _id: string
}
