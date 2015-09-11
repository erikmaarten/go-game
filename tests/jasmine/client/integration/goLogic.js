describe('Go logic', function() {
  describe('Get group', function() {
    it('should include all stones in group', function() {
      var board = "1111000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
      var inGroup = Game.getGroup(board, [0,1]);
      var expected = [ 0, 1, 2, 3, 22];
      expect(_.difference(expected, inGroup).length).toEqual(0);
      expect(inGroup.length).toEqual(expected.length);
    });

    it('should count all empty intersections that are contained by other stones', function() {
      var board = "0001000000000000000001100000000000000011100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
      var inGroup = Game.getGroup(board, [0,1]);
      expect(inGroup.length).toEqual(5);
    });

    it('should include all intersections if the board is empty', function() {
      var board = "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
      var inGroup = Game.getGroup(board, [0,1]);
      expect(inGroup.length).toEqual(BOARD_WIDTH*BOARD_WIDTH);
    });

  });
});