export const attachment = {
  data() {
    return {
      query: {
        export: {
          name: 'attachments.xlsx',
          size: 1000
        },
        items: [
          {
            name: 'name',
            placeholder: 'Name',
            span: 4,
            style: '',
            type: '',
            value: ''
          },
          {
            name: 'code',
            placeholder: 'Code',
            span: 4,
            style: '',
            type: '',
            code: ''
          }
        ]
      }
    }
  }
}
