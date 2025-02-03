import ReactDOMServer from "react-dom/server"

const Text = ({
    value,
}) =>
{
    const renderValueHtml = (value) =>
    {
		value = value.replace(/{(.*?)}/g, '<span class="field">$1</span>') // TODO: セキュリティリスクなのでコンポーネント化すべき
		value = value.replace(/\r\n/g, '<br />')
		value = value.replace(/(\n|\r)/g, '<br />')

        return value
    }

    return (<span dangerouslySetInnerHTML={{ __html: renderValueHtml(value)}} />)

}

export default Text