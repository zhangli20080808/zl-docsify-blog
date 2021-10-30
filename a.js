/**
 * 有如下一段 xml, 请使用 js 将其转换成如下 json 对象. 要求使用纯 JS 代码自行实现解析逻辑, 不可引用任何外部 xml 解析库, 不可参考社区或开源实现,
 * 也不可使用浏览器自带 DOMParser API 或 innerHTML.
 */
const xml = `
<list>
  <item id='1'>content1</item>
  <item>content2</item>
  <item>content3</item>
  <item>
    <name>hema</name>
    <value>frontend</value>
  </item>
</list>
`;

// 目标 json
const json = {
  tag: 'list',
  children: [
    {
      tag: 'item',
      children: 'content1',
    },
    {
      tag: 'item',
      children: 'content2',
    },
    {
      tag: 'item',
      children: 'content3',
    },
    {
      tag: 'item',
      children: [
        {
          tag: 'name',
          children: 'hema',
        },
        {
          tag: 'value',
          children: 'frontend',
        },
      ],
    },
  ],
};
const unicodeLetters =
  'a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD';
// 标签名
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeLetters}]*`;
// 标签开头
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

const startTagOpen = new RegExp('<(/?)([^<>/]+)(/?)>');
// 匹配标签结束的 > > <br/>
const startTagClose = /^\s*(\/?)>/;
// 匹配标签结尾 </title>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 属性正则 -》 aaa='aaa' a='aaa' a=aaa
const attribute = ``;

function start(tagName, attrs) {
  console.log(tagName, attrs); // list []
}
function end(tagName) {
  console.log(tagName, '11');
}

function parseXml(xml) {
  while (xml) {
    let textEnd = xml.indexOf('<');
    // console.log(textEnd,xml);
    if (textEnd == 1) {
      const statTagMatch = parseStartTag(xml); // 开始标签匹配结果
      if (statTagMatch) {
        // console.log(statTagMatch, 'statTagMatch'); // { tagName: 'list', attrs: [] } statTagMatch
        start(statTagMatch.tagName, statTagMatch.attrs);
        continue;
      }
      const endTagMatch = xml.match(endTag);
      console.log(endTagMatch, 'endTagMatch');
      if (endTagMatch) {
        endTagMatch(endTagMatch[0].length);
        end(endTagMatch[1]);
        continue;
      }
    }
  }

  function advance(n) {
    // 截取字符串,更新xml
    xml = xml.substring(n);
  }

  function parseStartTag() {
    const start = xml.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[2],
        attrs: [],
      };
      // console.log(match, start,'start');
      // 删除开始标签
      advance(start[0].length);
      // console.log(xml, 'xml', start);
      let end;
      let attr;
      // 不是结尾标签，能匹配到属性，对属性操作再做处理
      while (
        !(end = xml.match(startTagClose)) &&
        (attr = xml.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
        advance(attr[0].length); // 删除当前属性
      }
      // 删除闭合标签
      if (end) {
        advance(end[0].length);
        return match;
      }
    }
  }
}
// 创建ast树，进行后续cao'z
function createAstElement(tagName, attrs) {
  return {
    tag: tagName,
    children: [],
  };
}

function xml2json(xml) {
  let result;
  parseXml(xml);
  return result;
}
xml2json(xml);
// console.log(JSON.stringify(xml2json(xml)) === JSON.stringify(json));

// 强版

// 请扩展你的解析器实现, 使 xml 得到增强支持:

// 1. 支持 xml 标签属性
// 2. 解析算法具备较高性能, 时间复杂度达到 O(n)
// 3. 异常处理: 针对标签未闭合情况, 能报出异常信息

{
  /* <list>
  <item key="1">content1</item>
  <item key="2">content2</item>
  <item key="3">content3</item>
  <item key="4">
    <name id="hema-name">hema</name>
    <value id="hema-value">frontend</value>
  </item>
</list>

解析后需要转换生成的 json 如下: */
}

// 生成的 json
const json2 = {
  tag: 'list',
  children: [
    {
      tag: 'item',
      children: 'content1',
      props: {
        key: '1',
      },
    },
    {
      tag: 'item',
      children: 'content2',
      props: {
        key: '2',
      },
    },
    {
      tag: 'item',
      children: 'content3',
      props: {
        key: '3',
      },
    },
    {
      tag: 'item',
      children: [
        {
          tag: 'name',
          children: 'hema',
          props: {
            id: 'hema-name',
          },
        },
        {
          tag: 'value',
          children: 'frontend',
          props: {
            id: 'hema-value',
          },
        },
      ],
      props: {
        key: '4',
      },
    },
  ],
};
