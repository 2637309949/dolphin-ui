export default {
  common: {
    create: 'New',
    delete: 'Delete',
    update: 'Update',
    search: 'Search',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  route: {
    'Dashboard': 'Dashboard',
    'Documentation': 'Documentation',
    'Guide': 'Guide',
    'Permission': 'Permission',
    'PagePermission': 'Page Permission',
    'RolePermission': 'Role Permission',
    'DirectivePermission': 'Directive Permission',
    'Icons': 'Icons',
    'Components': 'Components',
    'Tinymce': 'Tinymce',
    'Markdown': 'Markdown',
    'JsonEditor': 'JSON Editor',
    'DndList': 'Dnd List',
    'SplitPane': 'SplitPane',
    'AvatarUpload': 'Avatar Upload',
    'Dropzone': 'Dropzone',
    'Sticky': 'Sticky',
    'CountTo': 'Count To',
    'ComponentMixin': 'Mixin',
    'BackToTop': 'Back To Top',
    'DragDialog': 'Drag Dialog',
    'DragSelect': 'Drag Select',
    'DragKanban': 'Drag Kanban',
    'Charts': 'Charts',
    'KeyboardChart': 'Keyboard Chart',
    'LineChart': 'Line Chart',
    'MixChart': 'Mix Chart',
    'Example': 'Example',
    'Nested': 'Nested Routes',
    'Menu1': 'Menu 1',
    'Menu1-1': 'Menu 1-1',
    'Menu1-2': 'Menu 1-2',
    'Menu1-2-1': 'Menu 1-2-1',
    'Menu1-2-2': 'Menu 1-2-2',
    'Menu1-3': 'Menu 1-3',
    'Menu2': 'Menu 2',
    'DynamicTable': 'Dynamic Table',
    'DragTable': 'Drag Table',
    'InlineEditTable': 'Inline Edit',
    'ComplexTable': 'Complex Table',
    'Tab': 'Tab',
    'Form': 'Form',
    'CreateArticle': 'Create Article',
    'EditArticle': 'Edit Article',
    'ArticleList': 'Article List',
    'ErrorPages': 'Error Pages',
    'Page401': '401',
    'Page404': '404',
    'ErrorLog': 'Error Log',
    'Excel': 'Excel',
    'ExportExcel': 'Export Excel',
    'SelectExcel': 'Export Selected',
    'MergeHeader': 'Merge Header',
    'UploadExcel': 'Upload Excel',
    'Zip': 'Zip',
    'Pdf': 'PDF',
    'ExportZip': 'Export Zip',
    'Theme': 'Theme',
    'ClipboardDemo': 'Clipboard',
    'I18n': 'I18n',
    'ExternalLink': 'External Link',
    'Profile': 'Profile'
  },
  navbar: {
    dashboard: 'Dashboard',
    github: 'Github',
    logOut: 'Log Out',
    profile: 'Profile',
    theme: 'Theme',
    size: 'Global Size'
  },
  login: {
    title: 'Login Form',
    logIn: 'Login',
    username: 'Username',
    password: 'Password',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    addRole: 'New Role',
    editPermission: 'Edit',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases, using v-permission will have no effect. For example: Element-UI  el-tab or el-table-column and other scenes that dynamically render dom. You can only do this with v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide'
  },
  components: {
    documentation: 'Documentation',
    tinymceTips: 'Rich text is a core feature of the management backend, but at the same time it is a place with lots of pits. In the process of selecting rich texts, I also took a lot of detours. The common rich texts on the market have been basically used, and I finally chose Tinymce. See the more detailed rich text comparison and introduction.',
    dropzoneTips: 'Because my business has special needs, and has to upload images to qiniu, so instead of a third party, I chose encapsulate it by myself. It is very simple, you can see the detail code in @/components/Dropzone.',
    stickyTips: 'when the page is scrolled to the preset position will be sticky on the top.',
    backToTopTips1: 'When the page is scrolled to the specified position, the Back to Top button appears in the lower right corner',
    backToTopTips2: 'You can customize the style of the button, show / hide, height of appearance, height of the return. If you need a text prompt, you can use element-ui el-tooltip elements externally',
    imageUploadTips: 'Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Imp',
    type: 'Type',
    remark: 'Remark',
    search: 'Search',
    add: 'Add',
    export: 'Export',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm'
  },
  example: {
    warning: 'Creating and editing pages cannot be cached by keep-alive because keep-alive include does not currently support caching based on routes, so it is currently cached based on component name. If you want to achieve a similar caching effect, you can use a browser caching scheme such as localStorage. Or do not use keep-alive include to cache all pages directly. See details'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name (default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name (default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading PDF.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  }
}
