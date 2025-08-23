import classNames from 'classnames/bind';
import styles from './submit.module.less';

let cx = classNames.bind(styles);

export const Button = (props: { base?: true | undefined; inprogress?: false | undefined; error?: false | undefined; disabled?: false | undefined; }) => {
  const { base = true, inprogress = false, error = false, disabled = false } = props
  let className = cx('test', {
    base: base,
    inProgress: inprogress,
    error: error,
    disabled: disabled,
  });
  let text = 'xiuxiu'
  return (
    <button className={className}>{text}</button>
  )
}
// 实际渲染效果:
{/* <button className={test base}>{text}</button> */ }
