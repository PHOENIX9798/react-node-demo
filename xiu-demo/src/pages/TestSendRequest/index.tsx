import classNames from 'classnames/bind';
import styles from './submit.module.less';
import { Button } from 'antd';

let cx = classNames.bind(styles);

export const TestSendRequest = (props: { base?: true | undefined; inProgress?: false | undefined; error?: false | undefined; disabled?: false | undefined; }) => {
  const { base = true, inProgress = false, error = false, disabled = false } = props
  let className = cx('test', {
    base,
    inProgress,
    error,
    disabled,
  });
  let text = 'xiuxiu'
  return (
    <>
      <div className={className}>testCss</div>
      <Button type='link'>xiuxiu</Button>
    </>
  )
}
// 实际渲染效果:
{/* <button className={test base}>{text}</button> */ }
