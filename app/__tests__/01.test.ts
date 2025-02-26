import * as fs from 'fs/promises';

// fsモジュールをモック化
jest.mock('fs/promises');

describe('ファイル削除機能のテスト', () => {
  // テスト後にモックをリセット
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('fs.unlinkが正常に動作すること', async () => {
    // モック関数の設定
    const mockUnlink = fs.unlink as jest.MockedFunction<typeof fs.unlink>;
    mockUnlink.mockResolvedValue(undefined);

    // テスト対象の関数を実行
    await fs.unlink("src/test/test.log");

    // 以下の検証を行う
    // 1. unlinkが呼び出されたか
    // 2. 正しいパスが渡されたか
    expect(mockUnlink).toHaveBeenCalledTimes(1);
    expect(mockUnlink).toHaveBeenCalledWith("src/test/test.log");
  });

  test('fs.unlinkがエラーを投げる場合', async () => {
    // エラーシナリオのモック設定
    const mockUnlink = fs.unlink as jest.MockedFunction<typeof fs.unlink>;
    const testError = new Error('ファイルが見つかりません');
    mockUnlink.mockRejectedValue(testError);

    // エラーが発生することを検証
    await expect(fs.unlink("src/test/test.log")).rejects.toThrow('ファイルが見つかりません');
    expect(mockUnlink).toHaveBeenCalledWith("src/test/test.log");
  });
});