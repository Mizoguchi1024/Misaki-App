import { Modal } from 'antd'

export default function TermsModal({ open, onCancel }): React.JSX.Element {
  return (
    <Modal
      title="条款"
      centered
      footer={null}
      open={open}
      onCancel={onCancel}
      destroyOnHidden
      className="select-none"
    >
      <div className="max-h-120 overflow-y-auto scrollbar-style">
        <p className="text-xl">
          <b>感谢您使用 Misaki！</b>
        </p>
        <p>
          本使用条款的适用情况包括您使用我们提供的任何基于人工智能的面向个人的服务,
          以及任何相关的软件应用程序和网站（统称为&quot;服务&quot;）.本条款构成您与南京小岬有限公司之间的协议,
          其中包括我们的服务条款以及通过仲裁解决争议的重要规定.⁠使用我们的服务, 即表示您同意本条款.
        </p>
        <br />
        <p className="text-xl">
          <b>注册和访问</b>
        </p>
        <p>
          <b>最低年龄.</b> 您必须年满 13 岁或您所在国家规定的最低年龄, 方可同意使用本服务.如果您未满
          18 岁, 则必须获得父母或法定监护人的许可方可使用本服务.
        </p>
        <p>
          <b>注册.</b>
          您必须提供准确完整的信息方可注册账户使用我们的服务.您不得与他人共享您的账户凭证或将您的帐户提供给他人使用,
          并对您账户下发生的所有活动负责.如果您代表他人或实体创建账户或使用服务,
          您必须有权代表他们接受本条款.
        </p>
        <br />
        <p className="text-xl">
          <b>使用我们的服务</b>
        </p>
        <p>
          <b>可做事项.</b>
          在遵守本条款的前提下, 您可以访问和使用我们的服务.使用我们的服务时,
          您必须遵守所有适用法律以及我们的共享与发布政策⁠、使用政策和我们向您提供的任何其他文件、指南或政策.
        </p>
        <p>
          <b>禁做事项. </b>
          您不得将我们的服务用于任何非法、有害或滥用活动.例如, 您可能不得：
        </p>
        <ul className="list-disc list-inside">
          <li>您不得使用我们的服务进行任何非法或未经授权的活动.</li>
          <li>您不得以侵犯、盗用或违反他人权利的方式使用我们的服务.</li>
          <li>您不得修改、复制、出租、出售或分发我们的任何服务.</li>
          <li>您不得企图或协助任何人逆向工程、反编译我们服务的源代码或组件.</li>
          <li>您不得自动或以编程方式提取数据或输出.</li>
          <li>您不得表示输出为人为生成, 而实际并非如此.</li>
          <li>
            您不得干扰或扰乱我们的服务, 包括规避任何费率限制或约束,
            或绕过我们在服务上设置的任何保护措施或安全缓解措施.
          </li>
        </ul>
      </div>
    </Modal>
  )
}
