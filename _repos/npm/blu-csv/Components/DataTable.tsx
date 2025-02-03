import React, { useEffect, useState, memo } from 'react';
import Encoding from 'encoding-japanese'
import { numToAlphabetColumn } from './util'

const DataTableRaw = memo( ({
	csvData, encoding, isNumberColumn
}) =>
{
	const encode = (value) =>
	{
		return Encoding.convert(value, {to: 'UNICODE', from: encoding})
	}
	
	return (
		<table className="DataTableRaw">
			<thead>
				<tr>
				{csvData[0] &&
					csvData[0].map((item, key) =>
					{
							return <th>{isNumberColumn ? parseInt(key): numToAlphabetColumn(parseInt(key))}</th>
					})
				}
				</tr>
			</thead>
			<tbody>
			{
				csvData.map((item, i) =>
				{
					return <tr>
					{
						csvData[i].map((item) =>
						{
							return <td>{encode(item)}</td>;
						})
					}
					</tr>
				})
			}
			</tbody>
		</table>
	);
})

const DataTableImport = ({
	csvData,
	setting,
	toFields,
	searchField,
	importFields,
	importTargets,
	setImportTargets,
	importResult,
	setImportResult,
	ResultComponent,
}) =>
{
	const encoding = 'encoding' in setting ? setting['encoding'] : 'SJIS'
	const ignoreHeader = 'ignoreHeader' in setting && parseInt(setting.ignoreHeader) ? parseInt(setting.ignoreHeader): 0
	const ignoreFooter = 'ignoreHeader' in setting && parseInt(setting.ignoreFooter) ? parseInt(setting.ignoreFooter): 0

	const encode = (value) =>
	{
		return Encoding.convert(value, {to: 'UNICODE', from: encoding})
	}

	const valReplace = (value, replace) =>
	{
		let newValue = value.toString();
		replace.map((rep) => {
			newValue = newValue.replaceAll(rep.from, rep.to);
		});

		return newValue;
	}

	const check = (i) =>
	{
		const newData = {...importTargets};
		if (newData[i])
		{
			delete newData[i];
		}
		else
		{
			newData[i] = {
				result: {},
			};
		}

		setImportTargets(newData);
	}

	const checkAll = () =>
	{
		const newData = {};
		csvData.map((item, i) =>
		{

			if (
				i >= ignoreHeader &&
				i < (csvData.length - ignoreFooter)
			)
			{
				newData[i] = {};
			}

		});
		setImportTargets(newData);
	}
	const uncheckAll = () =>
	{
		setImportTargets({});
	}

	return(<>
		<table className="DataTableImport">
			<thead>
				<tr>
					<th>
						インポート対象
						<div className="button-group">
							<button className="button small " onClick={ checkAll }>チェック</button>
							<button className="button small outline" onClick={ uncheckAll }>外す</button>
						</div>
					</th>
					<th>結果<button className="button small" onClick={() => setImportResult({})}>クリア</button></th>
					{searchField && (
					<th>検索[{searchField.from}]→[
						{Object.keys(toFields).find(key => searchField.to == key) ?
						toFields[Object.keys(toFields).find(key => searchField.to == key)]: searchField.to}
					]</th>
					)}

					<th className="spacer"></th>

					{importFields &&
						importFields.map((item, key) =>
						{
							return <th>
								[{setting.isNumberColumn ? parseInt(item.from) : numToAlphabetColumn(parseInt(item.from))}]
								→
								[
									{Object.keys(toFields).find(key => item.to == key)  ?
									toFields[Object.keys(toFields).find(key => item.to == key)]: item.to}
								]にインポート
							</th>
						})
					}

				</tr>
			</thead>
			<tbody>
			{
				csvData.map((item, i) =>
				{
					return (<tr>

						<th>
							<input type="checkbox" checked={importTargets[i]} onChange={ () => check(i)} />
						</th>

						<td className="result">
							<ResultComponent
								result={importResult[i]}
							/>
						</td>

						{searchField && (
						<td>{
							valReplace(
								encode(item[searchField.from]),
								searchField.replace
							)
						}</td>
						)}

						<td className="spacer"></td>

						{importFields &&
							importFields.map((importField, key) =>
							{
								return <td>
									{item[importField.from] &&
										valReplace(
											encode(item[importField.from]),
											importField.replace
										)
									}
								</td>
							})
						}

					</tr>)
				})
			}
			</tbody>
		</table>
	</>);
}

/*
const _ImportResult = ({result}) =>
{
	const style = {};
	if (result.status == 'error') style.color = 'red';

	return (<div>
		<span>[
			{result.live ? '本番': 'テスト'}
		]</span>
		<span style={style}>
			[{result.status}]
			{result.message && result.message}
		</span>
		<ul>
		{result.import_result && Object.keys(result.import_result).map((irk) =>
		{
			const ir = result.import_result[irk];
			return (<li>
				{ir.view && <a href={ir.view}>閲覧</a>}
				{ir.edit && <a href={ir.edit}>編集</a>}
				{ir.change && Object.keys(ir.change).map((ck) => {
					return (<span>
						{ck}:
						"{0 in ir.change[ck] && ir.change[ck][0]}" →
						"{1 in ir.change[ck] && ir.change[ck][1]}"
					</span>);
				})}
			</li>)
		})}
		</ul>
	</div>);
}
*/

const ImportResultComponent = ({
	result
}) =>
{
	return (<>
	{result && (
		<>
		{result.map((result) => (
			<div className={result.key}>
			<ul>
			{result.results.error.map((item) => (
				<li className="error">{item}</li>
			))}
			{result.results.warning.map((item) => (
				<li className="warning">{item}</li>
			))}
			{result.results.message.map((item) => (
				<li className="message">{item}</li>
			))}
			</ul>
			</div>
		))}
		</>
	) || (
		<span style={{ color: 'gray'}}>no result</span>
	)}
	</>)
}

const DataTable = ({
	csvData,
	setting,
	toFields,
	searchField = null,
	importFields,
	importTargets,
	setImportTargets,
	importResult,
	setImportResult,
	ResultComponent = ImportResultComponent
}) =>
{
	const [ showRawData, setShowRawData ] = useState(false)

	return (<>

		<div>
			<label>
				CSV元データ表示:
				<input type="checkbox" onChange={ (e) => setShowRawData(!showRawData) } checked={showRawData} />
			</label>
		</div>

		{showRawData && (<>
			<h3>元データ</h3>
			<DataTableRaw
				isNumberColumn={Boolean(setting.isNumberColumn)}
				csvData={csvData}
				encoding={setting.encoding}
			/>
		</>) || (<>
			<h3>インポートデータ</h3>
			<DataTableImport
				csvData={csvData}
				setting={setting}
				toFields={toFields}
				searchField={searchField}
				importFields={importFields}
				importTargets={importTargets}
				setImportTargets={setImportTargets}
				importResult={importResult}
				setImportResult={setImportResult}
				ResultComponent={ResultComponent}
			/>
		</>)}
	</>)
}

export default DataTable;
