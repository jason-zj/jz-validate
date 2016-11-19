# jz-validate
### 原生Js 表单验证插件

- 调用方法：validata(formId)方法调用!
```
<script>validata(form);</script>
```
- input、textarea添加验证属性 data-validate ！

```
<input type="text" placeholder="请输入邮箱" data-validate="email">
```

- 支持多重验证，中间加逗号！

```
<input type="text" placeholder="请输入帐号" data-validate="required,min[3]">
```

