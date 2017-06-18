## Classes

<dl>
<dt><a href="#PixDiff">PixDiff</a></dt>
<dd><p>PixDiff</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#savePage">savePage(tag, scrollTimeout)</a> ⇒ <code>Promise</code></dt>
<dd><p>Saves an image of the whole page</p>
</dd>
<dt><a href="#saveScreen">saveScreen(tag)</a> ⇒ <code>Promise</code></dt>
<dd><p>Saves an image of the screen</p>
</dd>
<dt><a href="#saveRegion">saveRegion(element, tag)</a> ⇒ <code>Promise</code></dt>
<dd><p>Saves an image of the screen region</p>
</dd>
<dt><a href="#checkPage">checkPage(tag, options)</a> ⇒ <code>object</code></dt>
<dd><p>Runs the comparison against the page</p>
</dd>
<dt><a href="#checkScreen">checkScreen(tag, options)</a> ⇒ <code>object</code></dt>
<dd><p>Runs the comparison against the screen</p>
</dd>
<dt><a href="#checkRegion">checkRegion(element, tag, options)</a> ⇒ <code>object</code></dt>
<dd><p>Runs the comparison against a region</p>
</dd>
</dl>

<a name="PixDiff"></a>

## PixDiff
PixDiff

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| basePath | <code>string</code> | Directory where baseline images are read/saved |
| diffPath | <code>string</code> | Directory where difference images are saved |
| baseline | <code>boolean</code> | Toggle saving baseline imags if not found |
| width | <code>int</code> | Width of browser |
| height | <code>int</code> | Height of browser |
| formatOptions | <code>object</code> | Flat object that holds custom options for formatString |
| formatString | <code>string</code> | Customizable image filename naming convention |
| offsets | <code>object</code> | Object with statusBar, addressBar and toolBar key/values |
| devicePixelRatio | <code>int</code> | Ratio of the (vertical) size of one physical pixel on the current display device to the size of one device independent pixels(dips) |
| innerHeight | <code>int</code> | Viewport height |
| pageWidth | <code>int</code> | Full page width |
| pageHeight | <code>int</code> | Full page height |
| browserName | <code>string</code> | Browser name from the WebDriver capabilities |
| logName | <code>string</code> | Log name from WebDriver capabilities |
| name | <code>string</code> | Name from WebDriver capabilities |
| platformName | <code>string</code> | Platform name from WebDriver capabilities |
| deviceName | <code>string</code> | Device name from WebDriver capabilities |
| nativeWebScreenshot | <code>boolean</code> | Android native screenshot from WebDriver capabilities |


* [PixDiff](#PixDiff)
    * [new PixDiff(options)](#new_PixDiff_new)
    * [.RESULT_UNKNOWN](#PixDiff.RESULT_UNKNOWN) : <code>int</code>
    * [.RESULT_DIFFERENT](#PixDiff.RESULT_DIFFERENT) : <code>int</code>
    * [.RESULT_SIMILAR](#PixDiff.RESULT_SIMILAR) : <code>int</code>
    * [.RESULT_IDENTICAL](#PixDiff.RESULT_IDENTICAL) : <code>int</code>
    * [.THRESHOLD_PIXEL](#PixDiff.THRESHOLD_PIXEL) : <code>string</code>
    * [.THRESHOLD_PERCENT](#PixDiff.THRESHOLD_PERCENT) : <code>string</code>
    * [.OUTPUT_DIFFERENT](#PixDiff.OUTPUT_DIFFERENT) : <code>int</code>
    * [.OUTPUT_SIMILAR](#PixDiff.OUTPUT_SIMILAR) : <code>int</code>
    * [.OUTPUT_ALL](#PixDiff.OUTPUT_ALL) : <code>int</code>

<a name="new_PixDiff_new"></a>

### new PixDiff(options)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> |  |
| options.basePath | <code>string</code> | Path to baseline images folder |
| options.diffPath | <code>string</code> | Path to difference folder |
| options.baseline | <code>boolean</code> | Save images not found in baseline |
| options.width | <code>int</code> | Width of browser |
| options.height | <code>int</code> | Height of browser |
| options.formatImageOptions | <code>object</code> | Custom variables for Image Name |
| options.formatImageName | <code>string</code> | Custom format image name |
| options.offsets | <code>object</code> | Mobile iOS/Android offsets required for obtaining element position |

<a name="PixDiff.RESULT_UNKNOWN"></a>

### PixDiff.RESULT_UNKNOWN : <code>int</code>
Unknown result of the comparison

**Kind**: static property of <code>[PixDiff](#PixDiff)</code>  
**Access:** public  
**Properties**

| Name |
| --- |
| RESULT_UNKNOWN | 

<a name="PixDiff.RESULT_DIFFERENT"></a>

### PixDiff.RESULT_DIFFERENT : <code>int</code>
The images are too different

**Kind**: static property of <code>[PixDiff](#PixDiff)</code>  
**Access:** public  
**Properties**

| Name |
| --- |
| RESULT_DIFFERENT | 

<a name="PixDiff.RESULT_SIMILAR"></a>

### PixDiff.RESULT_SIMILAR : <code>int</code>
The images are very similar, but still below the threshold

**Kind**: static property of <code>[PixDiff](#PixDiff)</code>  
**Access:** public  
**Properties**

| Name |
| --- |
| RESULT_SIMILAR | 

<a name="PixDiff.RESULT_IDENTICAL"></a>

### PixDiff.RESULT_IDENTICAL : <code>int</code>
The images are identical (or near identical)

**Kind**: static property of <code>[PixDiff](#PixDiff)</code>  
**Access:** public  
**Properties**

| Name |
| --- |
| RESULT_IDENTICAL | 

<a name="PixDiff.THRESHOLD_PIXEL"></a>

### PixDiff.THRESHOLD_PIXEL : <code>string</code>
Threshold-type for pixel

**Kind**: static property of <code>[PixDiff](#PixDiff)</code>  
**Access:** public  
**Properties**

| Name |
| --- |
| THRESHOLD_PIXEL | 

<a name="PixDiff.THRESHOLD_PERCENT"></a>

### PixDiff.THRESHOLD_PERCENT : <code>string</code>
Threshold-type for percent of all pixels

**Kind**: static property of <code>[PixDiff](#PixDiff)</code>  
**Access:** public  
**Properties**

| Name |
| --- |
| THRESHOLD_PERCENT | 

<a name="PixDiff.OUTPUT_DIFFERENT"></a>

### PixDiff.OUTPUT_DIFFERENT : <code>int</code>
Create output when images are different

**Kind**: static property of <code>[PixDiff](#PixDiff)</code>  
**Access:** public  
**Properties**

| Name |
| --- |
| OUTPUT_DIFFERENT | 

<a name="PixDiff.OUTPUT_SIMILAR"></a>

### PixDiff.OUTPUT_SIMILAR : <code>int</code>
Create output when images are similar or different

**Kind**: static property of <code>[PixDiff](#PixDiff)</code>  
**Access:** public  
**Properties**

| Name |
| --- |
| OUTPUT_SIMILAR | 

<a name="PixDiff.OUTPUT_ALL"></a>

### PixDiff.OUTPUT_ALL : <code>int</code>
Force output of all comparisons

**Kind**: static property of <code>[PixDiff](#PixDiff)</code>  
**Access:** public  
**Properties**

| Name |
| --- |
| OUTPUT_ALL | 

<a name="savePage"></a>

## savePage(tag, scrollTimeout) ⇒ <code>Promise</code>
Saves an image of the whole page

**Kind**: global function  
**Access:** public  
**Reject**: <code>Error</code>  
**Fulfil**: <code>null</code>  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | Baseline image name |
| scrollTimeout | <code>int</code> | Time between scrolls in milliseconds (default: 1000) |

**Example**  
```js
browser.pixdiff.savePage('imageA');
```
<a name="saveScreen"></a>

## saveScreen(tag) ⇒ <code>Promise</code>
Saves an image of the screen

**Kind**: global function  
**Access:** public  
**Reject**: <code>Error</code>  
**Fulfil**: <code>null</code>  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | Baseline image name |

**Example**  
```js
browser.pixdiff.saveScreen('imageA');
```
<a name="saveRegion"></a>

## saveRegion(element, tag) ⇒ <code>Promise</code>
Saves an image of the screen region

**Kind**: global function  
**Access:** public  
**Reject**: <code>Error</code>  
**Fulfil**: <code>null</code>  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Promise</code> | The ElementFinder for element lookup |
| tag | <code>string</code> | Baseline image name |

**Example**  
```js
browser.pixdiff.saveRegion(element(By.id('elementId')), 'imageA');
```
<a name="checkPage"></a>

## checkPage(tag, options) ⇒ <code>object</code>
Runs the comparison against the page

**Kind**: global function  
**Returns**: <code>object</code> - result  
**Access:** public  
**Reject**: <code>Error</code> - Baseline image not found  
**Fulfil**: <code>object</code> - PixelDiff result.code

 - `RESULT_UNKNOWN`: 0
 - `RESULT_DIFFERENT`: 1
 - `RESULT_SIMILAR`: 7
 - `RESULT_IDENTICAL`: 5  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | Baseline image name |
| options | <code>object</code> | Non-default Pixel-Diff options |

**Example**  
```js
browser.pixdiff.checkPage('imageA')
     .then(result => { console.log(result.code); });
```
<a name="checkScreen"></a>

## checkScreen(tag, options) ⇒ <code>object</code>
Runs the comparison against the screen

**Kind**: global function  
**Returns**: <code>object</code> - result  
**Access:** public  
**Reject**: <code>Error</code> - Baseline image not found  
**Fulfil**: <code>object</code> - PixelDiff result.code

 - `RESULT_UNKNOWN`: 0
 - `RESULT_DIFFERENT`: 1
 - `RESULT_SIMILAR`: 7
 - `RESULT_IDENTICAL`: 5  

| Param | Type | Description |
| --- | --- | --- |
| tag | <code>string</code> | Baseline image name |
| options | <code>object</code> | Non-default Pixel-Diff options |

**Example**  
```js
browser.pixdiff.checkScreen('imageA', {blockOut: [{x: 0, y: 0, width: 1366, height: 30}]})
     .then(result => { console.log(result.code); });
```
<a name="checkRegion"></a>

## checkRegion(element, tag, options) ⇒ <code>object</code>
Runs the comparison against a region

**Kind**: global function  
**Returns**: <code>object</code> - result  
**Access:** public  
**Reject**: <code>Error</code> - Baseline image not found  
**Fulfil**: <code>object</code> - PixelDiff `result.code`

 - `RESULT_UNKNOWN`: `0`
 - `RESULT_DIFFERENT`: `1`
 - `RESULT_SIMILAR`: `7`
 - `RESULT_IDENTICAL`: `5`  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Promise</code> | The ElementFinder for element lookup |
| tag | <code>string</code> | Baseline image name |
| options | <code>object</code> | Non-default Pixel-Diff options |

**Example**  
```js
browser.pixdiff.checkRegion(element(By.id('elementId')), 'imageA', {debug: true})
     .then(result => { console.log(result.code); });
```
<a name="loadMatchers"></a>

## .loadMatchers()
Load matchers for pix-diff

**Kind**: static function  
**Access:** public  
**Example**  
```js
const pixDiff = require('pix-diff');
     pixDiff.loadMatchers();
```
