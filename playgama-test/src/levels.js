export const PRODUCTS = {
  milk: { name: '牛奶', color: '#7d9ba4' },
  cookie: { name: '餅乾', color: '#bb8760' },
  tea: { name: '茶罐', color: '#7d9272' },
  honey: { name: '蜂蜜', color: '#c79842' }
};
export const LEVELS = [
  { title: '最後一件，放好了', note: '把最後一包餅乾，放回同伴旁邊。', shelves: [['milk','milk','milk'],['cookie','cookie'],['cookie']] },
  { title: '借個空位', note: '先借空架放一下，裡面的商品就能露出來。', shelves: [['milk','milk','cookie'],['cookie','cookie','milk'],[]] },
  { title: '多一位新朋友', note: '不用急，一次替一件商品找到位置。', shelves: [['milk','milk','cookie'],['cookie','cookie','tea'],['tea','tea','milk'],[]] },
  { title: '空位要慢慢騰出來', note: '慢慢騰出空間，讓同伴聚在一起。', shelves: [['milk','cookie','cookie'],['cookie','milk','tea'],['tea','tea','milk'],[]] },
  { title: '整理一座小店', note: '一座小店，四種小日常。需要時隨時看看提示。', shelves: [['milk','cookie','tea'],['cookie','tea','honey'],['tea','honey','milk'],['honey','milk','cookie'],[]] },
  { title: '午後的第一份補貨', note: '新的一批小日常，先從順手的地方整理。', shelves: [['honey','milk','honey'],['milk','cookie','tea'],['cookie','cookie','tea'],['tea','honey','milk'],[]] },
  { title: '餅乾與茶的約定', note: '替同伴留個位置，事情會慢慢順起來。', shelves: [['honey','cookie','milk'],['cookie','tea','cookie'],['milk','milk','honey'],['tea','honey','tea'],[]] },
  { title: '留一格給小驚喜', note: '先安頓外面的商品，再看看裡面藏著什麼。', shelves: [['honey','tea','milk'],['milk','honey','honey'],['tea','cookie','tea'],['cookie','milk','cookie'],[]] },
  { title: '窗邊的慢時光', note: '這一回，輕輕整理就好。', shelves: [['tea','cookie','cookie'],['honey','milk','milk'],['milk','tea','tea'],['cookie','honey','honey'],[]] },
  { title: '半日的小成就', note: '已經走到一半了，慢慢想也沒關係。', shelves: [['honey','cookie','honey'],['tea','milk','cookie'],['milk','honey','tea'],['cookie','tea','milk'],[]] },
  { title: '蜂蜜色的午後', note: '先找一組能靠在一起的同伴。', shelves: [['cookie','milk','honey'],['milk','honey','tea'],['honey','cookie','milk'],['tea','tea','cookie'],[]] },
  { title: '熟悉的小默契', note: '用熟悉的方式，一點一點騰出空間。', shelves: [['cookie','honey','milk'],['tea','milk','honey'],['milk','cookie','tea'],['honey','tea','cookie'],[]] },
  { title: '轉個彎就有位置', note: '空架可以借一下，不必一次整理到位。', shelves: [['tea','milk','honey'],['cookie','honey','milk'],['honey','cookie','tea'],['milk','tea','cookie'],[]] },
  { title: '給自己一杯茶', note: '放鬆一下，讓相同商品慢慢聚在一起。', shelves: [['tea','cookie','cookie'],['milk','honey','milk'],['honey','tea','tea'],['cookie','milk','honey'],[]] },
  { title: '小店的午後練習', note: '多想一小步，需要時就看看提示。', shelves: [['cookie','tea','honey'],['tea','cookie','tea'],['milk','honey','milk'],['honey','milk','cookie'],[]] },
  { title: '再留一點餘裕', note: '不用一路加快，這一架也可以慢慢來。', shelves: [['milk','cookie','cookie'],['tea','milk','honey'],['honey','tea','tea'],['cookie','honey','milk'],[]] },
  { title: '把日常排整齊', note: '先照顧眼前這一件，其他的稍後再說。', shelves: [['honey','cookie','tea'],['tea','milk','cookie'],['milk','tea','milk'],['cookie','honey','honey'],[]] },
  { title: '收店前的小整理', note: '外面的商品歸位，裡面的空間就露出來了。', shelves: [['honey','tea','honey'],['milk','honey','tea'],['cookie','milk','cookie'],['tea','cookie','milk'],[]] },
  { title: '最後一排暖陽', note: '把熟悉的技巧串起來，離整齊又近了一點。', shelves: [['honey','milk','honey'],['tea','cookie','tea'],['cookie','honey','cookie'],['milk','tea','milk'],[]] },
  { title: '今天也整理得很好', note: '最後一份小挑戰，照自己的步調完成就好。', shelves: [['honey','cookie','tea'],['tea','milk','cookie'],['milk','tea','honey'],['cookie','honey','milk'],[]] }
];
