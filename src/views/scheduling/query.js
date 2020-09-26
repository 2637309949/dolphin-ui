import i18n from '@/i18n'

export const scheduling = {
  data() {
    return {
      query: {
        export: {
          name: 'roles.xlsx',
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
