/*globals NO_STONE:true, BLACK_STONE:true, WHITE_STONE:true, STATUS:true */

NO_STONE = "0";
BLACK_STONE = "1";
WHITE_STONE = "2";

STATUS = {};
STATUS.move_ok = 0;
STATUS.superko_violation = 1;
STATUS.suicide_illegal = 2;
STATUS.not_your_turn = 3;
