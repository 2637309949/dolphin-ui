import i18n from '@/i18n'

export const user = {
  data() {
    return {
      query: {
        export: {
          name: 'users.xlsx',
          size: 1000
        },
        items: [
          {
            name: 'mobile',
            placeholder: i18n.t('Mobile'),
            span: 4,
            style: '',
            type: '',
            value: ''
          },
          {
            name: 'name',
            placeholder: i18n.t('Name'),
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
