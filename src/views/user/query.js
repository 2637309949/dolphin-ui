export const user = {
  data() {
    return {
      query: {
        export: {
          name: 'users.xlsx',
          rows: 1000
        },
        items: [
          {
            name: 'mobile',
            placeholder: 'Mobile',
            span: 4,
            style: '',
            type: '',
            value: ''
          },
          {
            name: 'name',
            placeholder: 'Name',
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
