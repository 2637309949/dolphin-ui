import i18n from '@/i18n'

export const table = {
  data() {
    return {
      query: {
        export: {
          name: 'tables.xlsx',
          size: 1000
        },
        items: [
          {
            name: 'name',
            placeholder: i18n.t('Name'),
            span: 4,
            style: '',
            type: '',
            value: ''
          },
          {
            name: 'code',
            placeholder: i18n.t('Code'),
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
