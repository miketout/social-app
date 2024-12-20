import React from 'react'
import {StyleSheet, Text as RNText, TextProps} from 'react-native'
import {UITextView} from 'react-native-uitextview'

import {lh, s} from '#/lib/styles'
import {TypographyVariant, useTheme} from '#/lib/ThemeContext'
import {logger} from '#/logger'
import {isIOS, isWeb} from '#/platform/detection'
import {applyFonts, useAlf} from '#/alf'
import {
  childHasEmoji,
  childIsString,
  renderChildrenWithEmoji,
  StringChild,
} from '#/components/Typography'
import {IS_DEV} from '#/env'

export type CustomTextProps = Omit<TextProps, 'children'> & {
  type?: TypographyVariant
  lineHeight?: number
  title?: string
  dataSet?: Record<string, string | number>
  selectable?: boolean
} & (
    | {
        emoji: true
        children: StringChild
      }
    | {
        emoji?: false
        children: TextProps['children']
      }
  )

export function Text({
  type = 'md',
  children,
  emoji,
  lineHeight,
  style,
  title,
  dataSet,
  selectable,
  ...props
}: React.PropsWithChildren<CustomTextProps>) {
  const theme = useTheme()
  const {fonts} = useAlf()

  if (IS_DEV) {
    if (!emoji && childHasEmoji(children)) {
      logger.warn(
        `Text: emoji detected but emoji not enabled: "${children}"\n\nPlease add <Text emoji />'`,
      )
    }

    if (emoji && !childIsString(children)) {
      logger.error('Text: when <Text emoji />, children can only be strings.')
    }
  }

  const textProps = React.useMemo(() => {
    const typography = theme.typography[type]
    const lineHeightStyle = lineHeight ? lh(theme, type, lineHeight) : undefined

    const flattened = StyleSheet.flatten([
      s.black,
      typography,
      lineHeightStyle,
      style,
    ])

    applyFonts(flattened, fonts.family)

    // should always be defined on `typography`
    // @ts-ignore
    if (flattened.fontSize) {
      // @ts-ignore
      flattened.fontSize = Math.round(
        // @ts-ignore
        flattened.fontSize * fonts.scaleMultiplier,
      )
    }

    return {
      uiTextView: selectable && isIOS,
      selectable,
      style: flattened,
      dataSet: isWeb
        ? Object.assign({tooltip: title}, dataSet || {})
        : undefined,
      ...props,
    }
  }, [
    dataSet,
    fonts.family,
    fonts.scaleMultiplier,
    lineHeight,
    props,
    selectable,
    style,
    theme,
    title,
    type,
  ])

  if (selectable && isIOS) {
    return (
      <UITextView {...textProps}>
        {isIOS && emoji
          ? renderChildrenWithEmoji(children, textProps)
          : children}
      </UITextView>
    )
  }

  return (
    <RNText {...textProps}>
      {isIOS && emoji ? renderChildrenWithEmoji(children, textProps) : children}
    </RNText>
  )
}
