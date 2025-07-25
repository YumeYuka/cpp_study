---
title: IO库
order: 8
---

# 第八章 IO库


## IO类

为了支持不同种类的IO处理操作，标准库定义了这几种类型：

- iostream 定义了用于读写流的基本类型

- fstream 定义了读写命名文件的类型

- sstream 定义了读写内存string对象的类型

它们分别定义在同名的头文件中。

**IO类型间的关系**

类型ifstream和istringstream都继承自istream。我们可以像使用istream对象一样来使用它们。对于ostream也是如此。

### IO对象无拷贝或赋值

由于不能拷贝IO对象，因此也不能将形参或返回类型设置为流类型。进行IO操作的函数通常以引用方式传递或返回流。

读写一个IO对象会改变其状态，因此传递和返回的引用不能是const的。

### 条件状态

IO类定义了一些函数和标志，可以帮助我们访问和操纵流的条件状态。见p279。

一个IO错误的例子：

```c++
int ival;
cin >> ival;
```

如果试图在标准输入上键入Boo，读操作就会失败，cin进入错误状态。

如果输入一个文件结束符标识，cin也会进入错误状态。

一个流一旦发生错误，其上后续的IO操作都会失败。确定一个流对象的状态的最简单的方法是将它当作一个条件来使用：

```c++
while (cin >> word)
    // ok
```

!!!note
	读取失败后，不会消耗掉缓冲区的内容。因此这种情况，通常读取一个字符串，然后转换字符串为数字。

### 管理输出缓冲

每个输出流都管理一个缓冲区，用来保存程序读写的数据。如果执行下面的代码：

```c++
os << "please enter a value: ";
```

文本串可能立即打印出来，但也有可能被操作系统保存在缓冲区中，随后再打印。这样可以带来很大的性能提升。

导致缓冲区刷新的原因有：

- 程序正常结束

- 缓冲区满时

- 使用操纵符，如endl，来显式刷新缓冲区

- 读cin或写cerr，都会导致cout的缓冲区被刷新

**刷新输出缓冲区**

IO库还提供了两个操纵符用于刷新缓冲区：

- flush 刷新缓冲区，但不输出任何额外字符

- ends 向缓冲区插入一个空字符，然后刷新缓冲区

**unitbuf操纵符**

如果想在每次输出操作后都刷新缓冲区，我们可以使用unitbuf操纵符。

```c++
cout << unitbuf;    // 所有输出操作后都会立即刷新缓冲区
cout << nounitbuf;  // 回到正常的缓冲方式
```

!!!warning
	如果程序崩溃，输出缓冲区不会刷新

## 文件输入输出

除了继承自iostream类型的行为之外，fstream中定义的类型还增加了一些新的成员来管理与流关联的文件。见p283。

### 使用文件流对象

当想要读写一个文件时，可以定义一个文件流对象，并将对象与文件关联起来。

每个文件流类都定义了一个名为open的成员函数，它完成一些系统相关的操作，来定位给定的文件，并视情况打开为读或写模式。

创建文件流对象时，如果提供了一个文件名，则open会被自动调用：

```c++
ifstream in(file);    // 构造一个ifstream并打开给定的文件
ofstream out;         // 输出文件流未关联到任何文件
```

!!!note
	当一个fstream对象被销毁时，close会自动被调用。

### 文件模式

每个流都有一个关联的文件模式，用来指出如何使用文件。见p286。

每个文件流类型都定义了一个默认的文件模式，当未指定文件模式时，就使用此默认模式。

- 与ifstream关联的文件默认以in模式打开；

- 与ofstream关联的文件默认以out模式打开；

- 与fstream关联的文件默认以in和out模式打开。

**以out模式打开文件会丢失已有数据**

默认情况下，当我们打开一个ofstream时，文件的内容会被丢弃。

阻止丢弃的方法是同时指定app模式：

```c++
ofstream out("file1");    // 文件被截断
ofstream app("file2", ofstream::app);    // 保留文件内容，写操作在文件末尾进行
```

## string流

sstream头文件定义了三个类型来支持内存IO：

- istringstream从string读取数据。

- ostringstream向string写入数据。

- stringstream既可以从string读数据，也可以向string写数据。

sstream增加了一些成员来管理与流相关联的string。见p287。

### 使用istringstream

当我们的某些工作是对整行文本进行处理，而其他一些工作是处理行内的单个单词时，通常可以使用istringstream。

### 使用ostringstream

当我们逐步构造输出，希望最后一期打印时，ostringstream是很有用的。