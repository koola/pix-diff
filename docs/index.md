## Classes

<dl>
<dt><a href="#PixDiff">PixDiff</a></dt>
<dd><p>PixDiff</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#saveScreen">saveScreen(tag)</a> ⇒ <code>promise</code></dt>
<dd><p>Saves an image of the screen</p>
</dd>
<dt><a href="#saveRegion">saveRegion(element, tag)</a> ⇒ <code>promise</code></dt>
<dd><p>Saves an image of the screen region</p>
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
| browserName | <code>string</code> | Browser name from the WebDriver capabilities |
| logName | <code>string</code> | Log name from WebDriver capabilities |
| name | <code>string</code> | Name from WebDriver capabilities |
| platformName | <code>string</code> | Platform name from WebDriver capabilities |
| deviceName | <code>string</code> | Device name from WebDriver capabilities |
| nativeWebScreenshot | <code>boolean</code> | Android native screenshot from WebDriver capabilities |


* [PixDiff](#PixDiff)
    * [new PixDiff(options)](#new_PixDiff_new)
    * [.THRESHOLD_PIXEL](#PixDiff.THRESHOLD_PIXEL) : <code>string</code>
    * [.THRESHOLD_PERCENT](#PixDiff.THRESHOLD_PERCENT) : <code>string</code>

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

<a name="saveScreen"></a>

## saveScreen(tag) ⇒ <code>promise</code>
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

## saveRegion(element, tag) ⇒ <code>promise</code>
Saves an image of the screen region

**Kind**: global function  
**Access:** public  
**Reject**: <code>Error</code>  
**Fulfil**: <code>null</code>  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>promise</code> | The ElementFinder for element lookup |
| tag | <code>string</code> | Baseline image name |

**Example**  
```js
browser.pixdiff.saveRegion(element(By.id('elementId')), 'imageA');
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
| options | <code>object</code> | Non-default Blink-Diff options |

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
| element | <code>promise</code> | The ElementFinder for element lookup |
| tag | <code>string</code> | Baseline image name |
| options | <code>object</code> | Non-default Blink-Diff options |

**Example**  
```js
browser.pixdiff.checkRegion(element(By.id('elementId')), 'imageA', {debug: true})
     .then(result => { console.log(result.code); });
```
