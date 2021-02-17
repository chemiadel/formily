import React from 'react'
import cls from 'classnames'
import { usePrefixCls } from '../__builtins__'
import { isVoidField } from '@formily/core'
import { connect, mapProps } from '@formily/react'
import { useFormLayout, useFormShallowLayout } from '../form-layout'
import { Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

export interface IFormItemProps {
  className?: string
  style?: React.CSSProperties
  prefixCls?: string
  label?: React.ReactNode
  colon?: boolean
  tooltip?: boolean
  labelAlign?: 'left' | 'right'
  labelWrap?: boolean
  labelWidth?: number
  wrapperWidth?: number
  labelCol?: number
  wrapperCol?: number
  wrapperAlign?: 'left' | 'right'
  wrapperWrap?: boolean
  fullness?: boolean
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
  size?: 'small' | 'default' | 'large'
  inset?: boolean
  extra?: React.ReactNode
  feedbackText?: React.ReactNode
  feedbackLayout?: 'loose' | 'terse' | 'popover' | (string & {})
  feedbackStatus?: 'error' | 'warning' | 'success' | 'pending' | (string & {})
  feedbackIcon?: React.ReactNode
  asterisk?: boolean
  gridSpan?: number
  bordered?: boolean
}

type ComposeFormItem = React.FC<IFormItemProps> & {
  BaseItem?: React.FC<IFormItemProps>
}

const useFormItemLayout = (props: IFormItemProps) => {
  const shallowFormLayout = useFormShallowLayout()
  const formLayout = useFormLayout()
  const layout = shallowFormLayout || formLayout || {}

  return {
    ...props,
    colon: props.colon ?? layout.colon,
    labelAlign: props.labelAlign ?? layout.labelAlign,
    labelWrap: props.labelWrap ?? layout.labelWrap,
    labelWidth: props.labelWidth ?? layout.labelWidth,
    wrapperWidth: props.wrapperWidth ?? layout.wrapperWidth,
    labelCol: props.labelCol ?? layout.labelCol,
    wrapperCol: props.wrapperCol ?? layout.wrapperCol,
    wrapperAlign: props.wrapperAlign ?? layout.wrapperAlign,
    wrapperWrap: props.wrapperWrap ?? layout.wrapperWrap,
    fullness: props.fullness ?? layout.fullness,
    size: props.size ?? layout.size,
    inset: props.inset ?? layout.inset,
    asterisk: props.asterisk,
    bordered: props.bordered ?? layout.bordered,
    feedbackIcon: props.feedbackIcon,
  }
}

export const BaseItem: React.FC<IFormItemProps> = (props) => {
  const { children, ...others } = props
  const formLayout = useFormItemLayout(others)
  const {
    label,
    colon = true,
    addonBefore,
    addonAfter,
    asterisk,
    feedbackStatus,
    extra,
    feedbackText,
    fullness,
    feedbackLayout,
    feedbackIcon,
    inset,
    bordered = true,
    labelWidth,
    wrapperWidth,
    labelCol,
    wrapperCol,
    labelAlign = 'right',
    wrapperAlign = 'left',
    size,
    labelWrap,
    wrapperWrap,
    tooltip,
  } = formLayout
  const labelStyle: any = {}
  const wrapperStyle: any = {}

  // 固定宽度
  let enableCol = false
  if (labelWidth || wrapperWidth) {
    if (labelWidth) {
      labelStyle.width = `${labelWidth}px`
      labelStyle.maxWidth = `${labelWidth}px`
    }
    if (wrapperWidth) {
      wrapperStyle.width = `${wrapperWidth}px`
      wrapperStyle.maxWidth = `${wrapperWidth}px`
    }
    // 栅格模式
  } else if (labelCol || wrapperCol) {
    enableCol = true
  }

  const prefixCls = usePrefixCls('formily-form-item', props)
  return (
    <div
      className={cls({
        [`${prefixCls}`]: true,
        [`${prefixCls}-${feedbackStatus}`]: !!feedbackStatus,
        [`${prefixCls}-size-${size}`]: !!size,
        [`${prefixCls}-feedback-layout-${feedbackLayout}`]: !!feedbackLayout,
        [`${prefixCls}-fullness`]: !!fullness || !!inset || !!feedbackIcon,
        [`${prefixCls}-inset`]: !!inset,
        [`${prefixCls}-label-align-${labelAlign}`]: true,
        [`${prefixCls}-control-align-${wrapperAlign}`]: true,
        [`${prefixCls}-label-wrap`]: !!labelWrap,
        [`${prefixCls}-control-wrap`]: !!wrapperWrap,
        [`${prefixCls}-bordered-none`]:
          bordered === false || !!inset || !!feedbackIcon,
        [props.className]: !!props.className,
      })}
    >
      <div
        className={cls({
          [`${prefixCls}-label`]: true,
          [`${prefixCls}-item-col-${labelCol}`]: enableCol && !!labelCol,
        })}
        style={labelStyle}
      >
        {asterisk && (
          <span className={cls(`${prefixCls}-asterisk`)}>{'*'}</span>
        )}
        <label>{label}</label>
        {tooltip && (
          <Tooltip placement="bottom" title={tooltip}>
            <QuestionCircleOutlined className={cls(`${prefixCls}-tooltip`)} />
          </Tooltip>
        )}
        {colon && <span className={cls(`${prefixCls}-colon`)}>{':'}</span>}
      </div>

      <div
        className={cls({
          [`${prefixCls}-control`]: true,
          [`${prefixCls}-item-col-${wrapperCol}`]: enableCol && !!wrapperCol,
        })}
      >
        <div className={cls(`${prefixCls}-control-content`)}>
          {addonBefore && (
            <div className={cls(`${prefixCls}-addon-before`)}>
              {addonBefore}
            </div>
          )}
          <div
            style={wrapperStyle}
            className={cls({
              [`${prefixCls}-control-content-component`]: true,
              [`${prefixCls}-control-content-component-has-feedback-icon`]: !!feedbackIcon,
            })}
          >
            {children}
            {feedbackIcon && (
              <div className={cls(`${prefixCls}-feedback-icon`)}>
                {feedbackIcon}
              </div>
            )}
          </div>
          {addonAfter && (
            <div className={cls(`${prefixCls}-addon-after`)}>{addonAfter}</div>
          )}
        </div>
        {!!feedbackText && (
          <div className={cls(`${prefixCls}-help`)}>{feedbackText}</div>
        )}
        {extra && <div className={cls(`${prefixCls}-extra`)}>{extra}</div>}
      </div>
    </div>
  )
}

// 适配
export const FormItem: ComposeFormItem = connect(
  BaseItem,
  mapProps(
    { extract: 'validateStatus' },
    { extract: 'title', to: 'label' },
    { extract: 'required' },
    (props, field) => {
      if (isVoidField(field)) return props
      if(!field) return props
      const takeMessage = () => {
        if (props.feedbackText) return props.feedbackText
        if (field.errors.length) return field.errors
        if (field.warnings.length) return field.warnings
        if (field.successes.length) return field.successes
      }

      return {
        feedbackText: takeMessage(),
        extra: props.extra || field.description,
      }
    },
    (props, field) => {
      if (isVoidField(field)) return props
      if(!field) return props
      return {
        feedbackStatus:
          field.validateStatus === 'validating'
            ? 'pending'
            : field.validateStatus,
      }
    },
    (props, field) => {
      if (isVoidField(field)) return props
      if(!field) return props
      let asterisk = false
      if (field.required) {
        asterisk = true
      }
      if ('asterisk' in props) {
        asterisk = props.asterisk
      }
      return {
        asterisk,
      }
    }
  )
)

FormItem.BaseItem = BaseItem

export default FormItem