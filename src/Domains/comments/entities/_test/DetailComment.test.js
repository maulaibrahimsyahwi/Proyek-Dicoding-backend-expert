import DetailComment from "../DetailComment.js";

describe("a DetailComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    const payload = {
      username: "dicoding",
      content: "sebuah komentar",
    };

    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY",
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    const payload = {
      id: 123,
      username: "dicoding",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah komentar",
      isDelete: "false",
      likeCount: "0",
    };

    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION",
    );
  });

  it("should create detailComment object correctly and display actual content when isDelete is false", () => {
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: "2021-08-08T07:22:33.555Z",
      content: "sebuah komentar",
      isDelete: false,
      likeCount: 5,
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.likeCount).toEqual(payload.likeCount);
  });

  it('should modify content to "**komentar telah dihapus**" when isDelete is true', () => {
    const payload = {
      id: "comment-123",
      username: "dicoding",
      date: "2021-08-08T07:26:21.338Z",
      content: "sebuah komentar",
      isDelete: true,
      likeCount: 0,
    };

    const detailComment = new DetailComment(payload);

    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual("**komentar telah dihapus**");
    expect(detailComment.likeCount).toEqual(payload.likeCount);
  });
});
