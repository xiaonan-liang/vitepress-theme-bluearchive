---
title: 构建自己的Cheat Engine
date: 2026-07-04
tags: [CheatEngine,教程]
pinned: false
---
---

# 构建自己的Cheat Engine

原作者标注：  
请记住，这个教程几乎是在三年前发布的。  
尽管下面列出的所有绕过方法在过去都有效，但从那时起，许多反作弊系统已经显著提升了检测 Cheat Engine 的措施，而我并没有机会相应地更新这个教程。  
因此，使用本文中解释的许多方法，在大多数现代内核保护反作弊系统上很可能不再有效。  
但它可能对许多用户模式保护的反作弊系统仍然有效。  

---

++*我仅对不必要的操作进行移除和对某些资源附上链接*++

原文链接:[https://www.unknowncheats.me/forum/anti-cheat-bypass/504191-undetected-cheat-engine-driver-2022-bypass-anticheats-eac.html](https://www.unknowncheats.me/forum/anti-cheat-bypass/504191-undetected-cheat-engine-driver-2022-bypass-anticheats-eac.html)  
视频教程  
[https://www.bilibili.com/video/BV1We4y1r7P2](https://www.bilibili.com/video/BV1We4y1r7P2)  
[https://www.bilibili.com/video/BV19h4y1B7nF/](https://www.bilibili.com/video/BV19h4y1B7nF/)

---

- **步骤 1：下载 Cheat Engine 源代码**  
在本网站上下载 Cheat Engine 源代码： [https://github.com/cheat-engine/cheat-engine](https://github.com/cheat-engine/cheat-engine)  
只需点击绿色的"Code"按钮，然后点击"Download Zip"即可下载最新源代码。

---

- #### 第二步：下载 Lazarus 编译器

为了将 Cheat Engine 的源代码编译成.exe 文件，你需要 Lazarus。  
你可以从这里下载： [https://www.lazarus-ide.org/index.php?page=downloads](https://www.lazarus-ide.org/index.php?page=downloads)

选择"Windows (32 Bits) Add ons"

之后先下载并安装 "lazarus-2.2.2-fpc-3.2.2-win32.exe" 版本。
然后下载并安装跨平台插件 "lazarus-2.2.2-fpc-3.2.2-cross-x86_64-win64-win32.exe"

---

- **步骤 3：更改驱动程序名称**  
许多反作弊系统仅仅因为黑名单中的驱动程序名称 "dbk64.sys" 就会阻止 Cheat Engine 驱动程序运行，因此在我们编译 Cheat Engine 之前，您需要将驱动程序名称更改为其他名称。  
为了完成这一操作，请打开下载的 Cheat Engine 源代码文件夹，并进入 "Cheat Engine -> dbk32"，在那里您将找到 "DBK32function.pas" 文件。  
使用您选择的任何编辑器打开此文件，例如 Notepad++.  
在这个文件中搜索字符串"dbk64.sys"，你会找到以下内容：  
将服务名称更改为其他名称，同时将 dbk64 和 dbk32 的 sys 文件更改为其他名称。  
例如"mynewdriver64.sys"和"mynewdriver32.sys"。  
之后保存文件并关闭它。

---

- **步骤 4：修改并编译 Cheat Engine**  
回到"Cheat Engine"文件夹内，向下滚动直到找到"cheatengine.lpi"文件。  
双击打开它，Lazarus 应该会启动。  
在左侧你应该能看到"对象检查器"窗口，里面包含名为"Cheat Engine"的"标题"选项。  
将其更改为您想要的任何其他内容（例如：Mynew Engine）。  
然后点击项目 -> 项目选项  
将打开一个新窗口，进入项目选项 -> 应用程序。  
将名为“Cheat Engine *版本*”的标题更改为其他内容。  
%% 同时点击"清除图标"，如果你需要，可以加载一个新的图标。  
此外，将"名称"中的" Cheat Engine"更改为其他内容。  
然后转到"版本信息"选项卡，将"CompanyName"和"FileDescription"更改为其他内容。  
接下来，转到"编译器选项 -> 路径"，并将"构建模式"选择为"Release 32-Bit"。  
将"Target file name (-0):"中的"cheatengine"替换为其他内容。  
然后将构建模式选择为"Release 64-Bit"，并将"cheatengine"字符串也替换掉。  
对"Release 64-Bit O4 AVX2"构建模式执行相同的操作。  
接着只需按下"OK"按钮。  
要编译 Cheat Engine，请前往“运行”->“编译多种模式”。  
勾选“发布 64 位”和“发布 64 位 O4 AVX2”来编译这两个版本。  
如果您更喜欢，也可以勾选“发布32位”，但这有时会导致错误消息，所以如果那样不起作用，就保持32位版本不勾选。  
然后只需点击“确定”，Cheat Engine 就会开始编译。

---

- **步骤 5：使用 HxD 修改 Cheat Engine 字符串**

编译完 Cheat Engine 后，你可以在"Cheat Engine" -> "bin"中找到它。  
打开它后，你会发现所有的"Cheat Engine"字符串仍然命名为"Cheat Engine"。  
由于某些反作弊系统可能会通过特征检测到"Cheat Engine"字符串，因此你需要将其更改为其他名称。  
要完成这个操作，你需要下载并安装程序“HxD”，你可以从这里下载：  
[https://mh-nexus.de/de/downloads.php?product=HxD20](https://mh-nexus.de/de/downloads.php?product=HxD20)  
只需打开 HxD，并将你的编译好的 CheatEngine.exe 或你选择的名字拖放到 HxD 中。  
然后点击“搜索”->“替换”。  
首先确保“全部”和“区分大小写”已被勾选。  
在"搜索："字段中输入"Cheat Engine"。  
在"替换为："字段中输入你想要的不同名称。  
确保你想要替换"Cheat Engine"的名称与"Cheat Engine"具有相同数量的字母和空格。  
"Cheat Engine"有 11 个字母和 1 个空格。  
例如你可以选择"我的新引擎"，因为它也有11个字母和1个空格。  
然后点击"全部替换"。  
现在再次为这些字符串做同样操作：  
"作弊引擎"，在我示例中将其替换为"我的新引擎"。  
"cheatengine"并在我的示例中将其替换为"mynewengine"  
"CheatEngine"并在我的示例中将其替换为"MynewEngine"  
同样，对"Unicode (UTF-16 little endian)"选项在"Text encoding:"中的所有字符串再次进行操作。  
之后点击"File" -> "Save"并关闭 HxD。  
现在如果你打开修改后的 Cheat Engine，你应该会看到所有"Cheat Engine"字符串都被替换为你选择的名字。

---

- **步骤 6：VMProtect**  
为了使 Cheat Engine 在一定程度上更安全地抵抗一些签名检查，你可以使用"VMProtect"。

据我记忆，它还能使 Cheat Engine 对 FiveM 反作弊系统"无法检测"。  
"VMProtect"是一款付费软件，但如果你在 Google 上搜索一下，可能会找到免费的版本  
附下载链接[https://wwi.lanzouy.com/irlsT06ul16f](https://wwi.lanzouy.com/irlsT06ul16f) 密码:6666 解压密码:52pojie  
如果你下载并安装了它，只需打开它并将 Cheat Engine 拖放到 VMProtect 程序中。  
然后点击“添加函数”并点击“入口点”。  
现在切换到“选项”选项卡并双击“虚拟化”。  
如果需要，再次执行此操作，直到它显示为“超频（变异+虚拟化）”  
然后点击“添加函数”。  
在“选项”标签页中，确保以下标记的功能与我下方截图中的设置相同，启用或禁用。  
然后点击箭头开始编译。  
编译完成后，你应该在“Cheat Engine” -> “bin”文件夹中找到一个名为“*你选择的名字*.vmp.exe”的文件。  
这个文件是 Vmprotected Cheat Engine，可能对某些反作弊程序来说更安全一些。  
如果它对你有效，就使用这个。

---

- **步骤 8：安装 Visual Studio 2019 + SDK + WDK**  
为了从带有内核或驱动程序反作弊机制的游戏内存中读写数据，我们也至少需要一个驱动程序。

你可能会问“驱动程序是什么”，这里有一个“简单”的解释：  
假设你需要编写一个能够访问核心操作系统数据结构的工具（带有反作弊机制的游戏），这些数据结构只能由在内核模式下运行的代码访问。  
你可以通过将工具拆分为两个组件来实现。  
第一个组件（Cheat Engine）在用户模式下运行，并呈现用户界面。  
第二个组件（Cheat Engine Driver）在内核模式下运行，并可以访问核心操作系统数据。  
在用户模式下运行的组件称为应用程序，而在内核模式下运行的组件称为"软件驱动程序"。  

这基本上意味着我们将使用一个驱动程序来从内存中读写，因为它与内核反作弊程序具有相同的访问级别。  
仅使用 Cheat Engine 是无效的，因为它只有用户模式的访问权限，并且会被反作弊程序阻止。  
由于 Cheat Engine 具有一个我们可以编译的驱动程序，我们将直接使用这个驱动程序。  

要构建这个驱动程序，我们需要 Visual Studio，它就像 "Lazarus" 一样是一个编译器，可以从源代码创建文件。  

您可以在以下网站下载 Visual Studio 2019： [https://docs.microsoft.com/de-de/vis.../release-notes](https://docs.microsoft.com/de-de/vis.../release-notes)  
只需点击蓝色的“下载 Community 2019”按钮即可下载。  
然后安装它，直到您看到这个窗口  

勾选“桌面开发 with C++”复选框，然后点击“单个组件”。  
在 Filter 输入框中输入"142 x64"。  

现在勾选以下复选框：  

- MSVC v142 - VS 2019 C++ x64/x86 Spectre 缓解库（最新版）  
- MSVC v142 - VS 2019 C++ x64/x86 构建工具（最新版）  
- 用于最新 v142 构建工具的 C++ ATL（x86 & x64）  
- 带有 Spectre 缓解措施的最新 v142 构建工具的 C++ ATL（x86 & x64）  
- 带有 Spectre 缓解措施的最新 v142 构建工具的 C++ MFC（x86 & x64）

然后点击右下角的"安装"按钮，并等待 Visual Studio 完成安装。  
一旦完成，请访问此网站： [https://developer.microsoft.com/de-d...s/sdk-archive/](https://developer.microsoft.com/de-d...s/sdk-archive/)  
向下滚动，在 Windows 10 下找到“Windows 10 SDK, version 2004 (10.0.19041.0)”，然后点击它旁边蓝色的“Install SDK”。  
然后打开它，并等待 SDK 安装完成。  
现在请访问此网站： [https://docs.microsoft.com/de-de/win...-wdk-downloads](https://docs.microsoft.com/de-de/win...-wdk-downloads)  
接着向下滚动，直到找到“步骤 2：安装 WDK”，然后点击蓝色的“WDK for Windows 10, version 2004”。  
安装它，如果一切顺利，你应该在最后看到这个消息。  
确保“Install Windows Driver kit Visual Studio extension”被勾选，然后点击“关闭”。  
之后，“VSIX Installer”应该会打开，确保点击“安装”。

---

- **步骤 9：修改并编译 CE 驱动程序（DBK）**

现在要编译 Cheat Engine 驱动程序，请进入您下载的"Cheat Engine"文件夹中的"DBKKernel"文件夹。  
在那里您会找到"DBKKernel.sln"文件，可以通过双击打开它。  
一旦 Visual Studio 打开，您会在右侧看到项目资源管理器。  
点击"DBKKernel"箭头 -> "驱动文件"，然后双击 DBK64.inf 文件。  
现在应该能看到这段文字  
在这里，你需要将 Cheat Engine 驱动名称从"DBK64"更改为你在第 3 步中选择的驱动名称。  
为此，按 CTRL + H 打开替换窗口。  
现在在第一个字段中输入"DBK64"，在第二个字段中输入你选择的驱动程序名称（不要带结尾的.sys）。  
然后点击下方图片中红色圈出的按钮来替换所有 DBK 字符串。  
现在所有原本是"DBK64"的字符串都应该被重命名为你的驱动程序名称。  
同时将"ManufacturerName="Cheat Engine""改为你的驱动程序名称。  
然后在"DBKKernel"上右键点击 -> "选项"，在新窗口中将它改为"无签名发布"和"x64"。  
在那个窗口中将"目标名称"从"DBK64"改为你的驱动程序名称。  
之后进入"构建事件" -> "构建后事件"，从"命令行"中删除所有文本，你可以选中它并删除。  
现在进入"驱动程序签名" -> "常规"，点击"测试证书"中的箭头 -> 点击"<创建测试证书...>"。  
然后点击"应用"按钮。  
在顶部栏将其更改为"无签名释放"和"x64"。  
现在你可以编译驱动程序。  
点击"构建" -> "构建解决方案"。  
如果你进入你的"Cheat Engine"文件夹 -> "bin"，你应该现在能找到你的驱动文件，它被命名为"*yourdrivername*.sys"

---

- **步骤 12：DBVM 虚拟机**  
如果你还想调试游戏并想找出访问或写入某个地址的内容，你可能需要 Cheat Engine 虚拟机（DBVM）。

警告：DBVM 虚拟机可能会被 EAC 游戏检测到，请自行承担风险！如果你只想从内存中读取和写入，则不需要这一步。  

那么你可能要问，什么是虚拟机？  
关于这个，我自己经验有限，我就把这句话放在这里吧。  

引用：


|  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原文由 **babama**[发表](https://www.unknowncheats.me/forum/anti-cheat-bypass/368421-hypervisor-post2655638.html#post2655638)*虚拟机是一种不同的概念和方法，特别是对于游戏黑客社区来说。* *在虚拟机普及之前，大多数物理计算机一次只能运行一个操作系统。这使得它们稳定，因为计算硬件只需要处理来自那个操作系统的请求。这种方法的缺点是浪费资源，因为操作系统并不能总是使用计算机的全部功率。* *一个虚拟机管理程序解决了这个问题。它是一个小型软件层，能够使多个操作系统相互运行，共享相同的物理计算资源。这些操作系统以虚拟机的形式存在——它们是模拟整个计算硬件环境的软件文件。* *虚拟机管理程序，也称为虚拟机监视器（VMM），管理这些虚拟机在相互运行时的状态。它从逻辑上分离虚拟机，为每个虚拟机分配其自身的计算能力、内存和存储资源的一部分。这防止了虚拟机之间相互干扰；因此，例如，如果一个操作系统发生崩溃或安全漏洞，其他系统仍然可以正常运行。* *情况比这更复杂，因为存在两种不同类型，但这目前不重要。* *游戏作弊社区试图利用虚拟机管理程序运行在操作系统之上，并因此运行在相应的反作弊程序之上的事实。* *这是一场猫鼠游戏。当反作弊系统仅限于内核（Ring 3）时，作弊者会转移到内核（Ring 0）以超越反作弊系统并偷偷绕过它。现在许多游戏都受到带有内核（Ring 0）组件的反作弊系统的保护，人们想要走捷径，进一步低于反作弊系统，并且由于操作系统在内核（Ring 0）以下没有其他层级，人们会转向所谓的内核（Ring -1）。操作系统以下的虚拟机管理程序。* *如果你唯一的目标是绕过游戏的反作弊系统，这是一种懒惰的方法。* |


Cheat Engines 虚拟机管理程序的好处是，我们不必自己编译它。  
我的意思是，如果你想要那样做，可以遵循"script daddy"的这个视频： [https://www.youtube.com/watch?v=X0lMBRaZgL4&t=1s](https://www.youtube.com/watch?v=X0lMBRaZgL4&t=1s)  
但在本教程中，你也可以直接使用 Cheat Engine 提供的预编译默认 Hypervisor，因为它目前不会被反作弊系统检测到。  
我将在这里上传默认的 CE Hypervisor 供你下载（vmdisk.img）：  
[https://www.unknowncheats.me/forum/d...=file&id=37389](https://www.unknowncheats.me/forum/d...=file&id=37389)  
下载 vmdisk.img 文件，并将其放入你的"Cheat Engine" -> "bin"文件夹中，该文件夹也包含 Cheat Engine 和驱动程序。  
现在打开 Cheat Engine，进入设置 -> 调试器选项，并确保切换到"使用 DBVM 级调试器"。  
然后进入"帮助" -> "关于"，并点击"您的系统支持 DBVM"。  
现在您的 DVBM 虚拟机正在运行，尽管反作弊程序仍在运行，您应该能够调试游戏并做其他一切操作

---

第 13 步：隐藏 OutputDebugString   
 ***(这个7.5源码好像已经把相关代码注释了)***  
这一步对于像英雄联盟和 Valorant 这样的游戏很重要。  

OutputDebugString() API 函数允许你的程序与调试器通信，通常用于调试。  
Cheatengine 利用这个函数并显示调试信息。  

然而，某些反作弊系统能够拦截并捕获调试信息，同时还能检测到由 Cheat Engine 引起的调试字符串。  
如果检测到，游戏可能会崩溃，甚至标记你的账号。  

要绕过这种情况，你可以继续阅读这个帖子：  
[Undetected Cheat Engine + Debugger for League of Legends | (2023 - 无崩溃)](https://www.unknowncheats.me/forum/league-of-legends/562594-undetected-cheat-engine-debugger-league-legends-2023-crashes.html)

---

**步骤 14：签名驱动程序和.exe 文件** 

如果你有一个有效的证书，或者从 Unknowncheats 上找到一个可用的证书（例如这个： [Codesigning Certificate](https://www.unknowncheats.me/forum/anti-cheat-bypass/563922-codesigning-certificate.html)），你可以使用该证书对你的驱动程序和 CheatEngine.exe 进行签名。 这可以让它们看起来更“合法”，从而欺骗某些反作弊系统，甚至可以绕过一些反作弊系统，比如“xigncode3”。 阅读这个帖子了解如何做到这一点：Bypassing Xigncode3 |

++*也可以使用吾爱大佬的工具*++

[https://www.52pojie.cn/forum.php?mod=viewthread&tid=1027420&highlight=%CA%FD%D7%D6%C7%A9%C3%FB%B9%A4%BE%DF](https://www.52pojie.cn/forum.php?mod=viewthread&tid=1027420&highlight=%CA%FD%D7%D6%C7%A9%C3%FB%B9%A4%BE%DF)

---

**修复：速度 hack**  
您可能已经注意到速度 hack 功能无法正常工作，并抛出"C 错误：不正确的 tcc 库"。  
要解决这个问题，如果您也想使用速度 hack 功能，需要将 tcc 编译为您正在使用的版本（x64，教程中使用的 x64 发布版）  

使用 Visual Studio 打开 tcc.sln。  
在项目菜单选项卡中，重新定位解决方案（我认为这能让它兼容你新版本的 VS？）  
在构建菜单选项卡中，打开配置管理器。  
将你的活动解决方案配置更改为“输出到 32（发布）”，并将你的活动解决方案平台更改为 Win32。  
在构建菜单选项卡中，构建解决方案。  
重复步骤 4 和 5，但使用配置 32（发布版）和 64（发布版）的其他 3 种组合，以及平台 Win32 和 x64，因为如果你不确定位如何工作（就像我一样），最好确保它适用于所有情况。  
现在应该不会再出现 tcc 库不正确的问题了。  

感谢@ [wtffwtf](https://www.unknowncheats.me/forum/3671786-post389.html) 和 [https://github.com/cheat-engine/chea...ent-1048948665](https://github.com/cheat-engine/chea...ent-1048948665) 提供的修复 

---

补充：

- 修改类名

Leledumbo 提供此方法：  
[https://forum.lazarus.freepascal.org/index.php?topic=15941.0](https://forum.lazarus.freepascal.org/index.php?topic=15941.0)  
[https://www.bilibili.com/video/BV1NW4y1e7j5/](https://www.bilibili.com/video/BV1NW4y1e7j5/)

只修改lazarus\lcl\interfaces\win32\win32int.pp中的ClsName和ClsNameW即可。  

```
  BOOL_RESULT: array[Boolean] of String = ('False', 'True');
  ClsName: array[0..6] of char = 'Window'#0;
  ClsHintName: array[0..10] of char = 'HintWindow'#0;
  EditClsName: array[0..4] of char = 'Edit'#0;
  ButtonClsName: array[0..6] of char = 'Button'#0;
  ComboboxClsName: array[0..8] of char = 'ComboBox'#0;
  ListboxClsName: array[0..8] of char = 'LISTBOX'#0;
  TabControlClsName: array[0..15] of char = 'SysTabControl32'#0;
  ListViewClsName: array[0..13] of char = 'SysListView32'#0;
```

还要修改：CE源代码中的cheat-engine-master\Cheat Engine\frmDriverLoadedUnit.pas

```
b [0]:=IsWindowVisible(FindWindow('Window',pchar(s)));  
b [1]:=IsWindowVisible(FindWindow('Window',pchar(s2)));
```

把上面的两个Window改成自己的名字。  
不然你设置DBVM后，主窗口会加载不出来。

# 随机窗口名

到mainunit2单元翻到最底下找到

```
procedure initcetitle;
begin
  CEnorm;=cename+BETA;
```

在procedure initcetitle;上面一行粘贴如下代码

```
function GetRandomStr :string;  
const  
  Chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*=[]{}:"<>?/\|._-~';  
var  
  S: string;  
  i, N: integer;  
begin  
  Randomize;  
  S := '';  
  for i := 1 to 10 do begin  
    N := Random(Length(Chars)) + 1;  
    S := S + Chars【N】;  
  end;  
  result := S;  
end;  
```

之后把cename+BETA替换成GetRandomStr



## veh调试器

如果还需要veh调试器的话去/Cheat Engine/VEHDebug/vehdebug.lpi构建

