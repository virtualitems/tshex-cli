type Props = {
  children?: React.ReactNode
}

/**
 * @description Example component that renders its children.
 */
export default function Example(props: Props) {
  const { children } = props
  return children
}
