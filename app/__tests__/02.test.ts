import * as fs from 'fs/promises';

// fsモジュールをモック化
jest.mock('fs/promises');

// JSDOM環境でのファイル削除機能のテスト
describe('jsdom環境でのファイル削除機能のテスト', () => {
  // テスト後にモックをリセット
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('fs.unlinkが正常に動作すること（jsdom環境）', async () => {
    // モック関数の設定
    const mockUnlink = fs.unlink as jest.MockedFunction<typeof fs.unlink>;
    mockUnlink.mockResolvedValue(undefined);

    // テスト対象の関数を実行
    await fs.unlink("public/test-file.txt");

    // 以下の検証を行う
    // 1. unlinkが呼び出されたか
    // 2. 正しいパスが渡されたか
    expect(mockUnlink).toHaveBeenCalledTimes(1);
    expect(mockUnlink).toHaveBeenCalledWith("public/test-file.txt");
  });

  test('fs.unlinkがエラーを投げる場合（jsdom環境）', async () => {
    // エラーシナリオのモック設定
    const mockUnlink = fs.unlink as jest.MockedFunction<typeof fs.unlink>;
    const testError = new Error('ファイルが存在しません');
    mockUnlink.mockRejectedValue(testError);

    // エラーが発生することを検証
    await expect(fs.unlink("public/test-file.txt")).rejects.toThrow('ファイルが存在しません');
    expect(mockUnlink).toHaveBeenCalledWith("public/test-file.txt");
  });

  test('DOM操作と組み合わせたファイル削除のテスト', async () => {
    // モック関数の設定
    const mockUnlink = fs.unlink as jest.MockedFunction<typeof fs.unlink>;
    mockUnlink.mockResolvedValue(undefined);
    
    // DOMイベントをシミュレートするための要素を作成
    document.body.innerHTML = `
      <button id="deleteButton">ファイル削除</button>
      <div id="result"></div>
    `;
    
    // ボタンクリックでファイル削除を行う関数
    const deleteFile = async () => {
      try {
        await fs.unlink("public/test-file.txt");
        document.getElementById('result')!.textContent = '削除成功';
      } catch (error) {
        document.getElementById('result')!.textContent = '削除失敗';
      }
    };
    
    // ボタンにイベントリスナーを追加
    const button = document.getElementById('deleteButton');
    button!.addEventListener('click', deleteFile);
    
    // ボタンクリックをシミュレート
    button!.click();
    
    // 非同期処理の完了を待つ
    await new Promise(process.nextTick);
    
    // 検証
    expect(mockUnlink).toHaveBeenCalledWith("public/test-file.txt");
    expect(document.getElementById('result')!.textContent).toBe('削除成功');
  });
});