// 最小化测试函数 - 用于验证函数部署
export default async function handler(request, context) {
  return new Response(JSON.stringify({
    message: "函数部署成功！",
    timestamp: new Date().toISOString(),
    functionName: "test-function"
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}