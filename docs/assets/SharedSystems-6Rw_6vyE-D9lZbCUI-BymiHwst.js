import{X as l,L as F,aa as se,a3 as p,S as w,h as Ie,ab as Oe,w as R,j as D,U as Fe,m as v,u as De,p as E,A as ae,f as Ee,_ as ze,g as M,J as z,T as b,b as He,q as H,ac as We,H as m,V as Y,ad as ie,y as G,ae as Le,a6 as U,af as X,a7 as B,ag as S,a8 as T,ah as Ve,d as J,e as k,ai as je,aj as $e,a as Ne,ak as ne,N as Q,al as qe,am as Ke,K as Ye,$ as Xe,an as oe,ao as ue,ap as le}from"./index-DHX5r9Hv.js";import{a as Je,u as de}from"./colorToUniform-BXaCBwVl-B2XTwPI5-CwAmvX3g.js";var Qe=`in vec2 vMaskCoord;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMaskTexture;

uniform float uAlpha;
uniform vec4 uMaskClamp;
uniform float uInverse;

out vec4 finalColor;

void main(void)
{
    float clip = step(3.5,
        step(uMaskClamp.x, vMaskCoord.x) +
        step(uMaskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, uMaskClamp.z) +
        step(vMaskCoord.y, uMaskClamp.w));

    // TODO look into why this is needed
    float npmAlpha = uAlpha;
    vec4 original = texture(uTexture, vTextureCoord);
    vec4 masky = texture(uMaskTexture, vMaskCoord);
    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

    float a = alphaMul * masky.r * npmAlpha * clip;

    if (uInverse == 1.0) {
        a = 1.0 - a;
    }

    finalColor = original * a;
}
`,Ze=`in vec2 aPosition;

out vec2 vTextureCoord;
out vec2 vMaskCoord;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
uniform mat3 uFilterMatrix;

vec4 filterVertexPosition(  vec2 aPosition )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
       
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(  vec2 aPosition )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( vec2 aPosition )
{
    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}   

void main(void)
{
    gl_Position = filterVertexPosition(aPosition);
    vTextureCoord = filterTextureCoord(aPosition);
    vMaskCoord = getFilterCoord(aPosition);
}
`,Z=`struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct MaskUniforms {
  uFilterMatrix:mat3x3<f32>,
  uMaskClamp:vec4<f32>,
  uAlpha:f32,
  uInverse:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;
@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) filterUv : vec2<f32>,
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}

@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
   getFilterCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) filterUv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var maskClamp = filterUniforms.uMaskClamp;
    var uAlpha = filterUniforms.uAlpha;

    var clip = step(3.5,
      step(maskClamp.x, filterUv.x) +
      step(maskClamp.y, filterUv.y) +
      step(filterUv.x, maskClamp.z) +
      step(filterUv.y, maskClamp.w));

    var mask = textureSample(uMaskTexture, uSampler, filterUv);
    var source = textureSample(uTexture, uSampler, uv);
    var alphaMul = 1.0 - uAlpha * (1.0 - mask.a);

    var a: f32 = alphaMul * mask.r * uAlpha * clip;

    if (filterUniforms.uInverse == 1.0) {
        a = 1.0 - a;
    }

    return source * a;
}
`;class et extends qe{constructor(e){const{sprite:t,...r}=e,s=new Ke(t.texture),i=new ae({uFilterMatrix:{value:new v,type:"mat3x3<f32>"},uMaskClamp:{value:s.uClampFrame,type:"vec4<f32>"},uAlpha:{value:1,type:"f32"},uInverse:{value:e.inverse?1:0,type:"f32"}}),n=Ye.from({vertex:{source:Z,entryPoint:"mainVertex"},fragment:{source:Z,entryPoint:"mainFragment"}}),o=Xe.from({vertex:Ze,fragment:Qe,name:"mask-filter"});super({...r,gpuProgram:n,glProgram:o,clipToViewport:!1,resources:{filterUniforms:i,uMaskTexture:t.texture.source}}),this.sprite=t,this._textureMatrix=s}set inverse(e){this.resources.filterUniforms.uniforms.uInverse=e?1:0}get inverse(){return this.resources.filterUniforms.uniforms.uInverse===1}apply(e,t,r,s){this._textureMatrix.texture=this.sprite.texture,e.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix,this.sprite).prepend(this._textureMatrix.mapCoord),this.resources.uMaskTexture=this.sprite.texture.source,e.applyFilter(this,t,r,s)}}const W=class ce{constructor(e,t){var r,s;this.state=Ie.for2d(),this._batchersByInstructionSet=Object.create(null),this._activeBatches=Object.create(null),this.renderer=e,this._adaptor=t,(s=(r=this._adaptor).init)==null||s.call(r,this)}static getBatcher(e){return new this._availableBatchers[e]}buildStart(e){let t=this._batchersByInstructionSet[e.uid];t||(t=this._batchersByInstructionSet[e.uid]=Object.create(null),t.default||(t.default=new se({maxTextures:this.renderer.limits.maxBatchableTextures}))),this._activeBatches=t,this._activeBatch=this._activeBatches.default;for(const r in this._activeBatches)this._activeBatches[r].begin()}addToBatch(e,t){if(this._activeBatch.name!==e.batcherName){this._activeBatch.break(t);let r=this._activeBatches[e.batcherName];r||(r=this._activeBatches[e.batcherName]=ce.getBatcher(e.batcherName),r.begin()),this._activeBatch=r}this._activeBatch.add(e)}break(e){this._activeBatch.break(e)}buildEnd(e){this._activeBatch.break(e);const t=this._activeBatches;for(const r in t){const s=t[r],i=s.geometry;i.indexBuffer.setDataWithSize(s.indexBuffer,s.indexSize,!0),i.buffers[0].setDataWithSize(s.attributeBuffer.float32View,s.attributeSize,!1)}}upload(e){const t=this._batchersByInstructionSet[e.uid];for(const r in t){const s=t[r],i=s.geometry;s.dirty&&(s.dirty=!1,i.buffers[0].update(s.attributeSize*4))}}execute(e){if(e.action==="startBatch"){const t=e.batcher,r=t.geometry,s=t.shader;this._adaptor.start(this,r,s)}this._adaptor.execute(this,e)}destroy(){this.state=null,this.renderer=null,this._adaptor=null;for(const e in this._activeBatches)this._activeBatches[e].destroy();this._activeBatches=null}};W.extension={type:[l.WebGLPipes,l.WebGPUPipes,l.CanvasPipes],name:"batch"};W._availableBatchers=Object.create(null);let he=W;F.handleByMap(l.Batcher,he._availableBatchers);F.add(se);const Mt={name:"texture-bit",vertex:{header:`

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,main:`
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;


        `,main:`
            outColor = textureSample(uTexture, uSampler, vUV);
        `}},Gt={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;


        `,main:`
            outColor = texture(uTexture, vUV);
        `}},tt=new H;class rt extends ie{constructor(){super(),this.filters=[new et({sprite:new $e(m.EMPTY),inverse:!1,resolution:"inherit",antialias:"inherit"})]}get sprite(){return this.filters[0].sprite}set sprite(e){this.filters[0].sprite=e}get inverse(){return this.filters[0].inverse}set inverse(e){this.filters[0].inverse=e}}class pe{constructor(e){this._activeMaskStage=[],this._renderer=e}push(e,t,r){const s=this._renderer;if(s.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"pushMaskBegin",mask:e,inverse:t._maskOptions.inverse,canBundle:!1,maskedContainer:t}),e.inverse=t._maskOptions.inverse,e.renderMaskToTexture){const i=e.mask;i.includeInBuild=!0,i.collectRenderables(r,s,null),i.includeInBuild=!1}s.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"pushMaskEnd",mask:e,maskedContainer:t,inverse:t._maskOptions.inverse,canBundle:!1})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"popMaskEnd",mask:e,inverse:t._maskOptions.inverse,canBundle:!1})}execute(e){const t=this._renderer,r=e.mask.renderMaskToTexture;if(e.action==="pushMaskBegin"){const s=G.get(rt);if(s.inverse=e.inverse,r){e.mask.mask.measurable=!0;const i=Le(e.mask.mask,!0,tt);e.mask.mask.measurable=!1,i.ceil();const n=t.renderTarget.renderTarget.colorTexture.source,o=b.getOptimalTexture(i.width,i.height,n._resolution,n.antialias);t.renderTarget.push(o,!0),t.globalUniforms.push({offset:i,worldColor:4294967295});const u=s.sprite;u.texture=o,u.worldTransform.tx=i.minX,u.worldTransform.ty=i.minY,this._activeMaskStage.push({filterEffect:s,maskedContainer:e.maskedContainer,filterTexture:o})}else s.sprite=e.mask.mask,this._activeMaskStage.push({filterEffect:s,maskedContainer:e.maskedContainer})}else if(e.action==="pushMaskEnd"){const s=this._activeMaskStage[this._activeMaskStage.length-1];r&&(t.type===E.WEBGL&&t.renderTarget.finishRenderPass(),t.renderTarget.pop(),t.globalUniforms.pop()),t.filter.push({renderPipeId:"filter",action:"pushFilter",container:s.maskedContainer,filterEffect:s.filterEffect,canBundle:!1})}else if(e.action==="popMaskEnd"){t.filter.pop();const s=this._activeMaskStage.pop();r&&b.returnTexture(s.filterTexture),G.return(s.filterEffect)}}destroy(){this._renderer=null,this._activeMaskStage=null}}pe.extension={type:[l.WebGLPipes,l.WebGPUPipes,l.CanvasPipes],name:"alphaMask"};class fe{constructor(e){this._colorStack=[],this._colorStackIndex=0,this._currentColor=0,this._renderer=e}buildStart(){this._colorStack[0]=15,this._colorStackIndex=1,this._currentColor=15}push(e,t,r){this._renderer.renderPipes.batch.break(r);const s=this._colorStack;s[this._colorStackIndex]=s[this._colorStackIndex-1]&e.mask;const i=this._colorStack[this._colorStackIndex];i!==this._currentColor&&(this._currentColor=i,r.add({renderPipeId:"colorMask",colorMask:i,canBundle:!1})),this._colorStackIndex++}pop(e,t,r){this._renderer.renderPipes.batch.break(r);const s=this._colorStack;this._colorStackIndex--;const i=s[this._colorStackIndex-1];i!==this._currentColor&&(this._currentColor=i,r.add({renderPipeId:"colorMask",colorMask:i,canBundle:!1}))}execute(e){this._renderer.colorMask.setMask(e.colorMask)}destroy(){this._colorStack=null}}fe.extension={type:[l.WebGLPipes,l.WebGPUPipes,l.CanvasPipes],name:"colorMask"};class me{constructor(e){this._maskStackHash={},this._maskHash=new WeakMap,this._renderer=e}push(e,t,r){var s;const i=e,n=this._renderer;n.renderPipes.batch.break(r),n.renderPipes.blendMode.setBlendMode(i.mask,"none",r),r.add({renderPipeId:"stencilMask",action:"pushMaskBegin",mask:e,inverse:t._maskOptions.inverse,canBundle:!1});const o=i.mask;o.includeInBuild=!0,this._maskHash.has(i)||this._maskHash.set(i,{instructionsStart:0,instructionsLength:0});const u=this._maskHash.get(i);u.instructionsStart=r.instructionSize,o.collectRenderables(r,n,null),o.includeInBuild=!1,n.renderPipes.batch.break(r),r.add({renderPipeId:"stencilMask",action:"pushMaskEnd",mask:e,inverse:t._maskOptions.inverse,canBundle:!1});const d=r.instructionSize-u.instructionsStart-1;u.instructionsLength=d;const c=n.renderTarget.renderTarget.uid;(s=this._maskStackHash)[c]??(s[c]=0)}pop(e,t,r){const s=e,i=this._renderer;i.renderPipes.batch.break(r),i.renderPipes.blendMode.setBlendMode(s.mask,"none",r),r.add({renderPipeId:"stencilMask",action:"popMaskBegin",inverse:t._maskOptions.inverse,canBundle:!1});const n=this._maskHash.get(e);for(let o=0;o<n.instructionsLength;o++)r.instructions[r.instructionSize++]=r.instructions[n.instructionsStart++];r.add({renderPipeId:"stencilMask",action:"popMaskEnd",canBundle:!1})}execute(e){var t;const r=this._renderer,s=r.renderTarget.renderTarget.uid;let i=(t=this._maskStackHash)[s]??(t[s]=0);e.action==="pushMaskBegin"?(r.renderTarget.ensureDepthStencil(),r.stencil.setStencilMode(p.RENDERING_MASK_ADD,i),i++,r.colorMask.setMask(0)):e.action==="pushMaskEnd"?(e.inverse?r.stencil.setStencilMode(p.INVERSE_MASK_ACTIVE,i):r.stencil.setStencilMode(p.MASK_ACTIVE,i),r.colorMask.setMask(15)):e.action==="popMaskBegin"?(r.colorMask.setMask(0),i!==0?r.stencil.setStencilMode(p.RENDERING_MASK_REMOVE,i):(r.renderTarget.clear(null,U.STENCIL),r.stencil.setStencilMode(p.DISABLED,i)),i--):e.action==="popMaskEnd"&&(e.inverse?r.stencil.setStencilMode(p.INVERSE_MASK_ACTIVE,i):r.stencil.setStencilMode(p.MASK_ACTIVE,i),r.colorMask.setMask(15)),this._maskStackHash[s]=i}destroy(){this._renderer=null,this._maskStackHash=null,this._maskHash=null}}me.extension={type:[l.WebGLPipes,l.WebGPUPipes,l.CanvasPipes],name:"stencilMask"};function Pt(a,e){for(const t in a.attributes){const r=a.attributes[t],s=e[t];s?(r.format??(r.format=s.format),r.offset??(r.offset=s.offset),r.instance??(r.instance=s.instance)):D(`Attribute ${t} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}st(a)}function st(a){const{buffers:e,attributes:t}=a,r={},s={};for(const i in e){const n=e[i];r[n.uid]=0,s[n.uid]=0}for(const i in t){const n=t[i];r[n.buffer.uid]+=Q(n.format).stride}for(const i in t){const n=t[i];n.stride??(n.stride=r[n.buffer.uid]),n.start??(n.start=s[n.buffer.uid]),s[n.buffer.uid]+=Q(n.format).stride}}const x=[];x[p.NONE]=void 0;x[p.DISABLED]={stencilWriteMask:0,stencilReadMask:0};x[p.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}};x[p.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}};x[p.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}};x[p.INVERSE_MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"not-equal",passOp:"keep"},stencilBack:{compare:"not-equal",passOp:"keep"}};class Rt{constructor(e){this._syncFunctionHash=Object.create(null),this._adaptor=e,this._systemCheck()}_systemCheck(){if(!Ve())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(e){const t=this.getUniformGroupData(e);e.buffer||(e.buffer=new J({data:new Float32Array(t.layout.size/4),usage:k.UNIFORM|k.COPY_DST}))}getUniformGroupData(e){return this._syncFunctionHash[e._signature]||this._initUniformGroup(e)}_initUniformGroup(e){const t=e._signature;let r=this._syncFunctionHash[t];if(!r){const s=Object.keys(e.uniformStructures).map(o=>e.uniformStructures[o]),i=this._adaptor.createUboElements(s),n=this._generateUboSync(i.uboElements);r=this._syncFunctionHash[t]={layout:i,syncFunction:n}}return this._syncFunctionHash[t]}_generateUboSync(e){return this._adaptor.generateUboSync(e)}syncUniformGroup(e,t,r){const s=this.getUniformGroupData(e);e.buffer||(e.buffer=new J({data:new Float32Array(s.layout.size/4),usage:k.UNIFORM|k.COPY_DST}));let i=null;return t||(t=e.buffer.data,i=e.buffer.dataInt32),r||(r=0),s.syncFunction(e.uniforms,t,i,r),!0}updateUniformGroup(e){if(e.isStatic&&!e._dirtyId)return!1;e._dirtyId=0;const t=this.syncUniformGroup(e);return e.buffer.update(),t}destroy(){this._syncFunctionHash=null}}const C=[{type:"mat3x3<f32>",test:a=>a.value.a!==void 0,ubo:`
            var matrix = uv[name].toArray(true);
            data[offset] = matrix[0];
            data[offset + 1] = matrix[1];
            data[offset + 2] = matrix[2];
            data[offset + 4] = matrix[3];
            data[offset + 5] = matrix[4];
            data[offset + 6] = matrix[5];
            data[offset + 8] = matrix[6];
            data[offset + 9] = matrix[7];
            data[offset + 10] = matrix[8];
        `,uniform:`
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `},{type:"vec4<f32>",test:a=>a.type==="vec4<f32>"&&a.size===1&&a.value.width!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `},{type:"vec2<f32>",test:a=>a.type==="vec2<f32>"&&a.size===1&&a.value.x!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `},{type:"vec4<f32>",test:a=>a.type==="vec4<f32>"&&a.size===1&&a.value.red!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `},{type:"vec3<f32>",test:a=>a.type==="vec3<f32>"&&a.size===1&&a.value.red!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `}];function Ut(a,e,t,r){const s=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `];let i=0;for(let o=0;o<a.length;o++){const u=a[o],d=u.data.name;let c=!1,h=0;for(let f=0;f<C.length;f++)if(C[f].test(u.data)){h=u.offset/4,s.push(`name = "${d}";`,`offset += ${h-i};`,C[f][e]||C[f].ubo),c=!0;break}if(!c)if(u.data.size>1)h=u.offset/4,s.push(t(u,h-i));else{const f=r[u.data.type];h=u.offset/4,s.push(`
                    v = uv.${d};
                    offset += ${h-i};
                    ${f};
                `)}i=h}const n=s.join(`
`);return new Function("uv","data","dataInt32","offset",n)}function g(a,e){return`
        for (let i = 0; i < ${a*e}; i++) {
            data[offset + (((i / ${a})|0) * 4) + (i % ${a})] = v[i];
        }
    `}const at={f32:`
        data[offset] = v;`,i32:`
        dataInt32[offset] = v;`,"vec2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];`,"vec3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,"vec4<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,"vec2<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];`,"vec3<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];`,"vec4<i32>":`
        dataInt32[offset] = v[0];
        dataInt32[offset + 1] = v[1];
        dataInt32[offset + 2] = v[2];
        dataInt32[offset + 3] = v[3];`,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,"mat3x3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,"mat4x4<f32>":`
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,"mat3x2<f32>":g(3,2),"mat4x2<f32>":g(4,2),"mat2x3<f32>":g(2,3),"mat4x3<f32>":g(4,3),"mat2x4<f32>":g(2,4),"mat3x4<f32>":g(3,4)},Bt={...at,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `};function it(a,e,t,r,s,i){const n=i?1:-1;return a.identity(),a.a=1/r*2,a.d=n*(1/s*2),a.tx=-1-e*a.a,a.ty=-n-t*a.d,a}const _=new Map;function ve(a,e){if(!_.has(a)){const t=new m({source:new B({resource:a,...e})}),r=()=>{_.get(a)===t&&_.delete(a)};t.once("destroy",r),t.source.once("destroy",r),_.set(a,t)}return _.get(a)}function nt(a){const e=a.colorTexture.source.resource;return globalThis.HTMLCanvasElement&&e instanceof HTMLCanvasElement&&document.body.contains(e)}const ge=class xe{constructor(e={}){if(this.uid=S("renderTarget"),this.colorTextures=[],this.dirtyId=0,this.isRoot=!1,this._size=new Float32Array(2),this._managedColorTextures=!1,e={...xe.defaultOptions,...e},this.stencil=e.stencil,this.depth=e.depth,this.isRoot=e.isRoot,typeof e.colorTextures=="number"){this._managedColorTextures=!0;for(let t=0;t<e.colorTextures;t++)this.colorTextures.push(new T({width:e.width,height:e.height,resolution:e.resolution,antialias:e.antialias}))}else{this.colorTextures=[...e.colorTextures.map(r=>r.source)];const t=this.colorTexture.source;this.resize(t.width,t.height,t._resolution)}this.colorTexture.source.on("resize",this.onSourceResize,this),(e.depthStencilTexture||this.stencil)&&(e.depthStencilTexture instanceof m||e.depthStencilTexture instanceof T?this.depthStencilTexture=e.depthStencilTexture.source:this.ensureDepthStencilTexture())}get size(){const e=this._size;return e[0]=this.pixelWidth,e[1]=this.pixelHeight,e}get width(){return this.colorTexture.source.width}get height(){return this.colorTexture.source.height}get pixelWidth(){return this.colorTexture.source.pixelWidth}get pixelHeight(){return this.colorTexture.source.pixelHeight}get resolution(){return this.colorTexture.source._resolution}get colorTexture(){return this.colorTextures[0]}onSourceResize(e){this.resize(e.width,e.height,e._resolution,!0)}ensureDepthStencilTexture(){this.depthStencilTexture||(this.depthStencilTexture=new T({width:this.width,height:this.height,resolution:this.resolution,format:"depth24plus-stencil8",autoGenerateMipmaps:!1,antialias:!1,mipLevelCount:1}))}resize(e,t,r=this.resolution,s=!1){this.dirtyId++,this.colorTextures.forEach((i,n)=>{s&&n===0||i.source.resize(e,t,r)}),this.depthStencilTexture&&this.depthStencilTexture.source.resize(e,t,r)}destroy(){this.colorTexture.source.off("resize",this.onSourceResize,this),this._managedColorTextures&&this.colorTextures.forEach(e=>{e.destroy()}),this.depthStencilTexture&&(this.depthStencilTexture.destroy(),delete this.depthStencilTexture)}};ge.defaultOptions={width:0,height:0,resolution:1,colorTextures:1,stencil:!1,depth:!1,antialias:!1,isRoot:!1};let A=ge;class At{constructor(e){this.rootViewPort=new M,this.viewport=new M,this.onRenderTargetChange=new je("onRenderTargetChange"),this.projectionMatrix=new v,this.defaultClearColor=[0,0,0,0],this._renderSurfaceToRenderTargetHash=new Map,this._gpuRenderTargetHash=Object.create(null),this._renderTargetStack=[],this._renderer=e,e.renderableGC.addManagedHash(this,"_gpuRenderTargetHash")}finishRenderPass(){this.adaptor.finishRenderPass(this.renderTarget)}renderStart({target:e,clear:t,clearColor:r,frame:s}){var i,n;this._renderTargetStack.length=0,this.push(e,t,r,s),this.rootViewPort.copyFrom(this.viewport),this.rootRenderTarget=this.renderTarget,this.renderingToScreen=nt(this.rootRenderTarget),(n=(i=this.adaptor).prerender)==null||n.call(i,this.rootRenderTarget)}postrender(){var e,t;(t=(e=this.adaptor).postrender)==null||t.call(e,this.rootRenderTarget)}bind(e,t=!0,r,s){const i=this.getRenderTarget(e),n=this.renderTarget!==i;this.renderTarget=i,this.renderSurface=e;const o=this.getGpuRenderTarget(i);(i.pixelWidth!==o.width||i.pixelHeight!==o.height)&&(this.adaptor.resizeGpuRenderTarget(i),o.width=i.pixelWidth,o.height=i.pixelHeight);const u=i.colorTexture,d=this.viewport,c=u.pixelWidth,h=u.pixelHeight;if(!s&&e instanceof m&&(s=e.frame),s){const f=u._resolution;d.x=s.x*f+.5|0,d.y=s.y*f+.5|0,d.width=s.width*f+.5|0,d.height=s.height*f+.5|0}else d.x=0,d.y=0,d.width=c,d.height=h;return it(this.projectionMatrix,0,0,d.width/u.resolution,d.height/u.resolution,!i.isRoot),this.adaptor.startRenderPass(i,t,r,d),n&&this.onRenderTargetChange.emit(i),i}clear(e,t=U.ALL,r){t&&(e&&(e=this.getRenderTarget(e)),this.adaptor.clear(e||this.renderTarget,t,r,this.viewport))}contextChange(){this._gpuRenderTargetHash=Object.create(null)}push(e,t=U.ALL,r,s){const i=this.bind(e,t,r,s);return this._renderTargetStack.push({renderTarget:i,frame:s}),i}pop(){this._renderTargetStack.pop();const e=this._renderTargetStack[this._renderTargetStack.length-1];this.bind(e.renderTarget,!1,null,e.frame)}getRenderTarget(e){return e.isTexture&&(e=e.source),this._renderSurfaceToRenderTargetHash.get(e)??this._initRenderTarget(e)}copyToTexture(e,t,r,s,i){r.x<0&&(s.width+=r.x,i.x-=r.x,r.x=0),r.y<0&&(s.height+=r.y,i.y-=r.y,r.y=0);const{pixelWidth:n,pixelHeight:o}=e;return s.width=Math.min(s.width,n-r.x),s.height=Math.min(s.height,o-r.y),this.adaptor.copyToTexture(e,t,r,s,i)}ensureDepthStencil(){this.renderTarget.stencil||(this.renderTarget.stencil=!0,this.adaptor.startRenderPass(this.renderTarget,!1,null,this.viewport))}destroy(){this._renderer=null,this._renderSurfaceToRenderTargetHash.forEach((e,t)=>{e!==t&&e.destroy()}),this._renderSurfaceToRenderTargetHash.clear(),this._gpuRenderTargetHash=Object.create(null)}_initRenderTarget(e){let t=null;return B.test(e)&&(e=ve(e).source),e instanceof A?t=e:e instanceof T&&(t=new A({colorTextures:[e]}),e.source instanceof B&&(t.isRoot=!0),e.once("destroy",()=>{t.destroy(),this._renderSurfaceToRenderTargetHash.delete(e);const r=this._gpuRenderTargetHash[t.uid];r&&(this._gpuRenderTargetHash[t.uid]=null,this.adaptor.destroyGpuRenderTarget(r))})),this._renderSurfaceToRenderTargetHash.set(e,t),t}getGpuRenderTarget(e){return this._gpuRenderTargetHash[e.uid]||(this._gpuRenderTargetHash[e.uid]=this.adaptor.initGpuRenderTarget(e))}resetState(){this.renderTarget=null,this.renderSurface=null}}class It extends Ne{constructor({buffer:e,offset:t,size:r}){super(),this.uid=S("buffer"),this._resourceType="bufferResource",this._touched=0,this._resourceId=S("resource"),this._bufferResource=!0,this.destroyed=!1,this.buffer=e,this.offset=t|0,this.size=r,this.buffer.on("change",this.onBufferChange,this)}onBufferChange(){this._resourceId=S("resource"),this.emit("change",this)}destroy(e=!1){this.destroyed=!0,e&&this.buffer.destroy(),this.emit("change",this),this.buffer=null}}class _e{constructor(e){this._renderer=e}updateRenderable(){}destroyRenderable(){}validateRenderable(){return!1}addRenderable(e,t){this._renderer.renderPipes.batch.break(t),t.add(e)}execute(e){e.isRenderable&&e.render(this._renderer)}destroy(){this._renderer=null}}_e.extension={type:[l.WebGLPipes,l.WebGPUPipes,l.CanvasPipes],name:"customRender"};function I(a,e){const t=a.instructionSet,r=t.instructions;for(let s=0;s<t.instructionSize;s++){const i=r[s];e[i.renderPipeId].execute(i)}}const ot=new v;class be{constructor(e){this._renderer=e}addRenderGroup(e,t){e.isCachedAsTexture?this._addRenderableCacheAsTexture(e,t):this._addRenderableDirect(e,t)}execute(e){e.isRenderable&&(e.isCachedAsTexture?this._executeCacheAsTexture(e):this._executeDirect(e))}destroy(){this._renderer=null}_addRenderableDirect(e,t){this._renderer.renderPipes.batch.break(t),e._batchableRenderGroup&&(G.return(e._batchableRenderGroup),e._batchableRenderGroup=null),t.add(e)}_addRenderableCacheAsTexture(e,t){const r=e._batchableRenderGroup??(e._batchableRenderGroup=G.get(de));r.renderable=e.root,r.transform=e.root.relativeGroupTransform,r.texture=e.texture,r.bounds=e._textureBounds,t.add(e),this._renderer.renderPipes.batch.addToBatch(r,t)}_executeCacheAsTexture(e){if(e.textureNeedsUpdate){e.textureNeedsUpdate=!1;const t=ot.identity().translate(-e._textureBounds.x,-e._textureBounds.y);this._renderer.renderTarget.push(e.texture,!0,null,e.texture.frame),this._renderer.globalUniforms.push({worldTransformMatrix:t,worldColor:4294967295}),I(e,this._renderer.renderPipes),this._renderer.renderTarget.finishRenderPass(),this._renderer.renderTarget.pop(),this._renderer.globalUniforms.pop()}e._batchableRenderGroup._batcher.updateElement(e._batchableRenderGroup),e._batchableRenderGroup._batcher.geometry.buffers[0].update()}_executeDirect(e){this._renderer.globalUniforms.push({worldTransformMatrix:e.inverseParentTextureTransform,worldColor:e.worldColorAlpha}),I(e,this._renderer.renderPipes),this._renderer.globalUniforms.pop()}}be.extension={type:[l.WebGLPipes,l.WebGPUPipes,l.CanvasPipes],name:"renderGroup"};function O(a,e){e||(e=0);for(let t=e;t<a.length&&a[t];t++)a[t]=null}const ut=new w,ee=oe|ue|le;function Te(a,e=!1){lt(a);const t=a.childrenToUpdate,r=a.updateTick++;for(const s in t){const i=Number(s),n=t[s],o=n.list,u=n.index;for(let d=0;d<u;d++){const c=o[d];c.parentRenderGroup===a&&c.relativeRenderGroupDepth===i&&ye(c,r,0)}O(o,u),n.index=0}if(e)for(let s=0;s<a.renderGroupChildren.length;s++)Te(a.renderGroupChildren[s],e)}function lt(a){const e=a.root;let t;if(a.renderGroupParent){const r=a.renderGroupParent;a.worldTransform.appendFrom(e.relativeGroupTransform,r.worldTransform),a.worldColor=ne(e.groupColor,r.worldColor),t=e.groupAlpha*r.worldAlpha}else a.worldTransform.copyFrom(e.localTransform),a.worldColor=e.localColor,t=e.localAlpha;t=t<0?0:t>1?1:t,a.worldAlpha=t,a.worldColorAlpha=a.worldColor+((t*255|0)<<24)}function ye(a,e,t){if(e===a.updateTick)return;a.updateTick=e,a.didChange=!1;const r=a.localTransform;a.updateLocalTransform();const s=a.parent;if(s&&!s.renderGroup?(t|=a._updateFlags,a.relativeGroupTransform.appendFrom(r,s.relativeGroupTransform),t&ee&&te(a,s,t)):(t=a._updateFlags,a.relativeGroupTransform.copyFrom(r),t&ee&&te(a,ut,t)),!a.renderGroup){const i=a.children,n=i.length;for(let d=0;d<n;d++)ye(i[d],e,t);const o=a.parentRenderGroup,u=a;u.renderPipeId&&!o.structureDidChange&&o.updateRenderable(u)}}function te(a,e,t){if(t&ue){a.groupColor=ne(a.localColor,e.groupColor);let r=a.localAlpha*e.groupAlpha;r=r<0?0:r>1?1:r,a.groupAlpha=r,a.groupColorAlpha=a.groupColor+((r*255|0)<<24)}t&le&&(a.groupBlendMode=a.localBlendMode==="inherit"?e.groupBlendMode:a.localBlendMode),t&oe&&(a.globalDisplayStatus=a.localDisplayStatus&e.globalDisplayStatus),a._updateFlags=0}function dt(a,e){const{list:t,index:r}=a.childrenRenderablesToUpdate;let s=!1;for(let i=0;i<r;i++){const n=t[i];if(s=e[n.renderPipeId].validateRenderable(n),s)break}return a.structureDidChange=s,s}const ct=new v;class ke{constructor(e){this._renderer=e}render({container:e,transform:t}){const r=e.parent,s=e.renderGroup.renderGroupParent;e.parent=null,e.renderGroup.renderGroupParent=null;const i=this._renderer;let n=ct;t&&(n=n.copyFrom(e.renderGroup.localTransform),e.renderGroup.localTransform.copyFrom(t));const o=i.renderPipes;this._updateCachedRenderGroups(e.renderGroup,null),this._updateRenderGroups(e.renderGroup),i.globalUniforms.start({worldTransformMatrix:t?e.renderGroup.localTransform:e.renderGroup.worldTransform,worldColor:e.renderGroup.worldColorAlpha}),I(e.renderGroup,o),o.uniformBatch&&o.uniformBatch.renderEnd(),t&&e.renderGroup.localTransform.copyFrom(n),e.parent=r,e.renderGroup.renderGroupParent=s}destroy(){this._renderer=null}_updateCachedRenderGroups(e,t){if(e.isCachedAsTexture){if(!e.updateCacheTexture)return;t=e}e._parentCacheAsTextureRenderGroup=t;for(let r=e.renderGroupChildren.length-1;r>=0;r--)this._updateCachedRenderGroups(e.renderGroupChildren[r],t);if(e.invalidateMatrices(),e.isCachedAsTexture){if(e.textureNeedsUpdate){const r=e.root.getLocalBounds();r.ceil();const s=e.texture;e.texture&&b.returnTexture(e.texture,!0);const i=this._renderer,n=e.textureOptions.resolution||i.view.resolution,o=e.textureOptions.antialias??i.view.antialias,u=e.textureOptions.scaleMode??"linear",d=b.getOptimalTexture(r.width,r.height,n,o);d._source.style=new He({scaleMode:u}),e.texture=d,e._textureBounds||(e._textureBounds=new H),e._textureBounds.copyFrom(r),s!==e.texture&&e.renderGroupParent&&(e.renderGroupParent.structureDidChange=!0)}}else e.texture&&(b.returnTexture(e.texture,!0),e.texture=null)}_updateRenderGroups(e){const t=this._renderer,r=t.renderPipes;if(e.runOnRender(t),e.instructionSet.renderPipes=r,e.structureDidChange?O(e.childrenRenderablesToUpdate.list,0):dt(e,r),Te(e),e.structureDidChange?(e.structureDidChange=!1,this._buildInstructions(e,t)):this._updateRenderables(e),e.childrenRenderablesToUpdate.index=0,t.renderPipes.batch.upload(e.instructionSet),!(e.isCachedAsTexture&&!e.textureNeedsUpdate))for(let s=0;s<e.renderGroupChildren.length;s++)this._updateRenderGroups(e.renderGroupChildren[s])}_updateRenderables(e){const{list:t,index:r}=e.childrenRenderablesToUpdate;for(let s=0;s<r;s++){const i=t[s];i.didViewUpdate&&e.updateRenderable(i)}O(t,r)}_buildInstructions(e,t){const r=e.root,s=e.instructionSet;s.reset();const i=t.renderPipes?t:t.batch.renderer,n=i.renderPipes;n.batch.buildStart(s),n.blendMode.buildStart(),n.colorMask.buildStart(),r.sortableChildren&&r.sortChildren(),r.collectRenderablesWithEffects(s,i,null),n.batch.buildEnd(s),n.blendMode.buildEnd(s)}}ke.extension={type:[l.WebGLSystem,l.WebGPUSystem,l.CanvasSystem],name:"renderGroup"};class Ce{constructor(e){this._renderer=e}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.bounds=e.visualBounds,t.texture=e._texture}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=new de;return t.renderable=e,t.transform=e.groupTransform,t.texture=e._texture,t.bounds=e.visualBounds,t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}}Ce.extension={type:[l.WebGLPipes,l.WebGPUPipes,l.CanvasPipes],name:"sprite"};const L=class Se{constructor(){this.clearBeforeRender=!0,this._backgroundColor=new R(0),this.color=this._backgroundColor,this.alpha=1}init(e){e={...Se.defaultOptions,...e},this.clearBeforeRender=e.clearBeforeRender,this.color=e.background||e.backgroundColor||this._backgroundColor,this.alpha=e.backgroundAlpha,this._backgroundColor.setAlpha(e.backgroundAlpha)}get color(){return this._backgroundColor}set color(e){R.shared.setValue(e).alpha<1&&this._backgroundColor.alpha===1&&D("Cannot set a transparent background on an opaque canvas. To enable transparency, set backgroundAlpha < 1 when initializing your Application."),this._backgroundColor.setValue(e)}get alpha(){return this._backgroundColor.alpha}set alpha(e){this._backgroundColor.setAlpha(e)}get colorRgba(){return this._backgroundColor.toArray()}destroy(){}};L.extension={type:[l.WebGLSystem,l.WebGPUSystem,l.CanvasSystem],name:"background",priority:0};L.defaultOptions={backgroundAlpha:1,backgroundColor:0,clearBeforeRender:!0};let ht=L;const y={};F.handle(l.BlendMode,a=>{if(!a.name)throw new Error("BlendMode extension must have a name property");y[a.name]=a.ref},a=>{delete y[a.name]});class we{constructor(e){this._isAdvanced=!1,this._filterHash=Object.create(null),this._renderer=e,this._renderer.runners.prerender.add(this)}prerender(){this._activeBlendMode="normal",this._isAdvanced=!1}setBlendMode(e,t,r){if(this._activeBlendMode===t){this._isAdvanced&&this._renderableList.push(e);return}this._activeBlendMode=t,this._isAdvanced&&this._endAdvancedBlendMode(r),this._isAdvanced=!!y[t],this._isAdvanced&&(this._beginAdvancedBlendMode(r),this._renderableList.push(e))}_beginAdvancedBlendMode(e){this._renderer.renderPipes.batch.break(e);const t=this._activeBlendMode;if(!y[t]){D(`Unable to assign BlendMode: '${t}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);return}let r=this._filterHash[t];r||(r=this._filterHash[t]=new ie,r.filters=[new y[t]]);const s={renderPipeId:"filter",action:"pushFilter",renderables:[],filterEffect:r,canBundle:!1};this._renderableList=s.renderables,e.add(s)}_endAdvancedBlendMode(e){this._renderableList=null,this._renderer.renderPipes.batch.break(e),e.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}buildStart(){this._isAdvanced=!1}buildEnd(e){this._isAdvanced&&this._endAdvancedBlendMode(e)}destroy(){this._renderer=null,this._renderableList=null;for(const e in this._filterHash)this._filterHash[e].destroy();this._filterHash=null}}we.extension={type:[l.WebGLPipes,l.WebGPUPipes,l.CanvasPipes],name:"blendMode"};const P={png:"image/png",jpg:"image/jpeg",webp:"image/webp"},V=class Me{constructor(e){this._renderer=e}_normalizeOptions(e,t={}){return e instanceof w||e instanceof m?{target:e,...t}:{...t,...e}}async image(e){const t=z.get().createImage();return t.src=await this.base64(e),t}async base64(e){e=this._normalizeOptions(e,Me.defaultImageOptions);const{format:t,quality:r}=e,s=this.canvas(e);if(s.toBlob!==void 0)return new Promise((i,n)=>{s.toBlob(o=>{if(!o){n(new Error("ICanvas.toBlob failed!"));return}const u=new FileReader;u.onload=()=>i(u.result),u.onerror=n,u.readAsDataURL(o)},P[t],r)});if(s.toDataURL!==void 0)return s.toDataURL(P[t],r);if(s.convertToBlob!==void 0){const i=await s.convertToBlob({type:P[t],quality:r});return new Promise((n,o)=>{const u=new FileReader;u.onload=()=>n(u.result),u.onerror=o,u.readAsDataURL(i)})}throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented")}canvas(e){e=this._normalizeOptions(e);const t=e.target,r=this._renderer;if(t instanceof m)return r.texture.generateCanvas(t);const s=r.textureGenerator.generateTexture(e),i=r.texture.generateCanvas(s);return s.destroy(!0),i}pixels(e){e=this._normalizeOptions(e);const t=e.target,r=this._renderer,s=t instanceof m?t:r.textureGenerator.generateTexture(e),i=r.texture.getPixels(s);return t instanceof w&&s.destroy(!0),i}texture(e){return e=this._normalizeOptions(e),e.target instanceof m?e.target:this._renderer.textureGenerator.generateTexture(e)}download(e){e=this._normalizeOptions(e);const t=this.canvas(e),r=document.createElement("a");r.download=e.filename??"image.png",r.href=t.toDataURL("image/png"),document.body.appendChild(r),r.click(),document.body.removeChild(r)}log(e){const t=e.width??200;e=this._normalizeOptions(e);const r=this.canvas(e),s=r.toDataURL();console.log(`[Pixi Texture] ${r.width}px ${r.height}px`);const i=["font-size: 1px;",`padding: ${t}px 300px;`,`background: url(${s}) no-repeat;`,"background-size: contain;"].join(" ");console.log("%c ",i)}destroy(){this._renderer=null}};V.extension={type:[l.WebGLSystem,l.WebGPUSystem],name:"extract"};V.defaultImageOptions={format:"png",quality:1};let pt=V;class j extends m{static create(e){return new j({source:new T(e)})}resize(e,t,r){return this.source.resize(e,t,r),this}}const ft=new M,mt=new H,vt=[0,0,0,0];class Ge{constructor(e){this._renderer=e}generateTexture(e){var t;e instanceof w&&(e={target:e,frame:void 0,textureSourceOptions:{},resolution:void 0});const r=e.resolution||this._renderer.resolution,s=e.antialias||this._renderer.view.antialias,i=e.target;let n=e.clearColor;n?n=Array.isArray(n)&&n.length===4?n:R.shared.setValue(n).toArray():n=vt;const o=((t=e.frame)==null?void 0:t.copyTo(ft))||We(i,mt).rectangle;o.width=Math.max(o.width,1/r)|0,o.height=Math.max(o.height,1/r)|0;const u=j.create({...e.textureSourceOptions,width:o.width,height:o.height,resolution:r,antialias:s}),d=v.shared.translate(-o.x,-o.y);return this._renderer.render({container:i,transform:d,target:u,clearColor:n}),u.source.updateMipmaps(),u}destroy(){this._renderer=null}}Ge.extension={type:[l.WebGLSystem,l.WebGPUSystem],name:"textureGenerator"};class Pe{constructor(e){this._stackIndex=0,this._globalUniformDataStack=[],this._uniformsPool=[],this._activeUniforms=[],this._bindGroupPool=[],this._activeBindGroups=[],this._renderer=e}reset(){this._stackIndex=0;for(let e=0;e<this._activeUniforms.length;e++)this._uniformsPool.push(this._activeUniforms[e]);for(let e=0;e<this._activeBindGroups.length;e++)this._bindGroupPool.push(this._activeBindGroups[e]);this._activeUniforms.length=0,this._activeBindGroups.length=0}start(e){this.reset(),this.push(e)}bind({size:e,projectionMatrix:t,worldTransformMatrix:r,worldColor:s,offset:i}){const n=this._renderer.renderTarget.renderTarget,o=this._stackIndex?this._globalUniformDataStack[this._stackIndex-1]:{worldTransformMatrix:new v,worldColor:4294967295,offset:new Fe},u={projectionMatrix:t||this._renderer.renderTarget.projectionMatrix,resolution:e||n.size,worldTransformMatrix:r||o.worldTransformMatrix,worldColor:s||o.worldColor,offset:i||o.offset,bindGroup:null},d=this._uniformsPool.pop()||this._createUniforms();this._activeUniforms.push(d);const c=d.uniforms;c.uProjectionMatrix=u.projectionMatrix,c.uResolution=u.resolution,c.uWorldTransformMatrix.copyFrom(u.worldTransformMatrix),c.uWorldTransformMatrix.tx-=u.offset.x,c.uWorldTransformMatrix.ty-=u.offset.y,Je(u.worldColor,c.uWorldColorAlpha,0),d.update();let h;this._renderer.renderPipes.uniformBatch?h=this._renderer.renderPipes.uniformBatch.getUniformBindGroup(d,!1):(h=this._bindGroupPool.pop()||new De,this._activeBindGroups.push(h),h.setResource(d,0)),u.bindGroup=h,this._currentGlobalUniformData=u}push(e){this.bind(e),this._globalUniformDataStack[this._stackIndex++]=this._currentGlobalUniformData}pop(){this._currentGlobalUniformData=this._globalUniformDataStack[--this._stackIndex-1],this._renderer.type===E.WEBGL&&this._currentGlobalUniformData.bindGroup.resources[0].update()}get bindGroup(){return this._currentGlobalUniformData.bindGroup}get globalUniformData(){return this._currentGlobalUniformData}get uniformGroup(){return this._currentGlobalUniformData.bindGroup.resources[0]}_createUniforms(){return new ae({uProjectionMatrix:{value:new v,type:"mat3x3<f32>"},uWorldTransformMatrix:{value:new v,type:"mat3x3<f32>"},uWorldColorAlpha:{value:new Float32Array(4),type:"vec4<f32>"},uResolution:{value:[0,0],type:"vec2<f32>"}},{isStatic:!0})}destroy(){this._renderer=null}}Pe.extension={type:[l.WebGLSystem,l.WebGPUSystem,l.CanvasSystem],name:"globalUniforms"};let gt=1;class Re{constructor(){this._tasks=[],this._offset=0}init(){Y.system.add(this._update,this)}repeat(e,t,r=!0){const s=gt++;let i=0;return r&&(this._offset+=1e3,i=this._offset),this._tasks.push({func:e,duration:t,start:performance.now(),offset:i,last:performance.now(),repeat:!0,id:s}),s}cancel(e){for(let t=0;t<this._tasks.length;t++)if(this._tasks[t].id===e){this._tasks.splice(t,1);return}}_update(){const e=performance.now();for(let t=0;t<this._tasks.length;t++){const r=this._tasks[t];if(e-r.offset-r.last>=r.duration){const s=e-r.start;r.func(s),r.last=e}}}destroy(){Y.system.remove(this._update,this),this._tasks.length=0}}Re.extension={type:[l.WebGLSystem,l.WebGPUSystem,l.CanvasSystem],name:"scheduler",priority:0};let re=!1;function xt(a){if(!re){if(z.get().getNavigator().userAgent.toLowerCase().indexOf("chrome")>-1){const e=[`%c  %c  %c  %c  %c PixiJS %c v${X} (${a}) http://www.pixijs.com/

`,"background: #E72264; padding:5px 0;","background: #6CA2EA; padding:5px 0;","background: #B5D33D; padding:5px 0;","background: #FED23F; padding:5px 0;","color: #FFFFFF; background: #E72264; padding:5px 0;","color: #E72264; background: #FFFFFF; padding:5px 0;"];globalThis.console.log(...e)}else globalThis.console&&globalThis.console.log(`PixiJS ${X} - ${a} - http://www.pixijs.com/`);re=!0}}class ${constructor(e){this._renderer=e}init(e){if(e.hello){let t=this._renderer.name;this._renderer.type===E.WEBGL&&(t+=` ${this._renderer.context.webGLVersion}`),xt(t)}}}$.extension={type:[l.WebGLSystem,l.WebGPUSystem,l.CanvasSystem],name:"hello",priority:-2};$.defaultOptions={hello:!1};function _t(a){let e=!1;for(const r in a)if(a[r]==null){e=!0;break}if(!e)return a;const t=Object.create(null);for(const r in a){const s=a[r];s&&(t[r]=s)}return t}function bt(a){let e=0;for(let t=0;t<a.length;t++)a[t]==null?e++:a[t-e]=a[t];return a.length-=e,a}let Tt=0;const N=class Ue{constructor(e){this._managedRenderables=[],this._managedHashes=[],this._managedArrays=[],this._renderer=e}init(e){e={...Ue.defaultOptions,...e},this.maxUnusedTime=e.renderableGCMaxUnusedTime,this._frequency=e.renderableGCFrequency,this.enabled=e.renderableGCActive}get enabled(){return!!this._handler}set enabled(e){this.enabled!==e&&(e?(this._handler=this._renderer.scheduler.repeat(()=>this.run(),this._frequency,!1),this._hashHandler=this._renderer.scheduler.repeat(()=>{for(const t of this._managedHashes)t.context[t.hash]=_t(t.context[t.hash])},this._frequency),this._arrayHandler=this._renderer.scheduler.repeat(()=>{for(const t of this._managedArrays)bt(t.context[t.hash])},this._frequency)):(this._renderer.scheduler.cancel(this._handler),this._renderer.scheduler.cancel(this._hashHandler),this._renderer.scheduler.cancel(this._arrayHandler)))}addManagedHash(e,t){this._managedHashes.push({context:e,hash:t})}addManagedArray(e,t){this._managedArrays.push({context:e,hash:t})}prerender({container:e}){this._now=performance.now(),e.renderGroup.gcTick=Tt++,this._updateInstructionGCTick(e.renderGroup,e.renderGroup.gcTick)}addRenderable(e){this.enabled&&(e._lastUsed===-1&&(this._managedRenderables.push(e),e.once("destroyed",this._removeRenderable,this)),e._lastUsed=this._now)}run(){var e;const t=this._now,r=this._managedRenderables,s=this._renderer.renderPipes;let i=0;for(let n=0;n<r.length;n++){const o=r[n];if(o===null){i++;continue}const u=o.renderGroup??o.parentRenderGroup,d=((e=u==null?void 0:u.instructionSet)==null?void 0:e.gcTick)??-1;if(((u==null?void 0:u.gcTick)??0)===d&&(o._lastUsed=t),t-o._lastUsed>this.maxUnusedTime){if(!o.destroyed){const c=s;u&&(u.structureDidChange=!0),c[o.renderPipeId].destroyRenderable(o)}o._lastUsed=-1,i++,o.off("destroyed",this._removeRenderable,this)}else r[n-i]=o}r.length-=i}destroy(){this.enabled=!1,this._renderer=null,this._managedRenderables.length=0,this._managedHashes.length=0,this._managedArrays.length=0}_removeRenderable(e){const t=this._managedRenderables.indexOf(e);t>=0&&(e.off("destroyed",this._removeRenderable,this),this._managedRenderables[t]=null)}_updateInstructionGCTick(e,t){e.instructionSet.gcTick=t;for(const r of e.renderGroupChildren)this._updateInstructionGCTick(r,t)}};N.extension={type:[l.WebGLSystem,l.WebGPUSystem],name:"renderableGC",priority:0};N.defaultOptions={renderableGCActive:!0,renderableGCMaxUnusedTime:6e4,renderableGCFrequency:3e4};let yt=N;const q=class Be{constructor(e){this._renderer=e,this.count=0,this.checkCount=0}init(e){e={...Be.defaultOptions,...e},this.checkCountMax=e.textureGCCheckCountMax,this.maxIdle=e.textureGCAMaxIdle??e.textureGCMaxIdle,this.active=e.textureGCActive}postrender(){this._renderer.renderingToScreen&&(this.count++,this.active&&(this.checkCount++,this.checkCount>this.checkCountMax&&(this.checkCount=0,this.run())))}run(){const e=this._renderer.texture.managedTextures;for(let t=0;t<e.length;t++){const r=e[t];r.autoGarbageCollect&&r.resource&&r._touched>-1&&this.count-r._touched>this.maxIdle&&(r._touched=-1,r.unload())}}destroy(){this._renderer=null}};q.extension={type:[l.WebGLSystem,l.WebGPUSystem],name:"textureGC"};q.defaultOptions={textureGCActive:!0,textureGCAMaxIdle:null,textureGCMaxIdle:60*60,textureGCCheckCountMax:600};let kt=q;const K=class Ae{get autoDensity(){return this.texture.source.autoDensity}set autoDensity(e){this.texture.source.autoDensity=e}get resolution(){return this.texture.source._resolution}set resolution(e){this.texture.source.resize(this.texture.source.width,this.texture.source.height,e)}init(e){e={...Ae.defaultOptions,...e},e.view&&(Ee(ze,"ViewSystem.view has been renamed to ViewSystem.canvas"),e.canvas=e.view),this.screen=new M(0,0,e.width,e.height),this.canvas=e.canvas||z.get().createCanvas(),this.antialias=!!e.antialias,this.texture=ve(this.canvas,e),this.renderTarget=new A({colorTextures:[this.texture],depth:!!e.depth,isRoot:!0}),this.texture.source.transparent=e.backgroundAlpha<1,this.resolution=e.resolution}resize(e,t,r){this.texture.source.resize(e,t,r),this.screen.width=this.texture.frame.width,this.screen.height=this.texture.frame.height}destroy(e=!1){(typeof e=="boolean"?e:e!=null&&e.removeView)&&this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas)}};K.extension={type:[l.WebGLSystem,l.WebGPUSystem,l.CanvasSystem],name:"view",priority:0};K.defaultOptions={width:800,height:600,autoDensity:!1,antialias:!1};let Ct=K;const Ot=[ht,Pe,$,Ct,ke,kt,Ge,pt,Oe,yt,Re],Ft=[we,he,Ce,be,pe,me,fe,_e];export{It as A,Ut as B,C,Ft as F,Gt as G,At as I,Ot as O,Pt as P,Rt as R,Bt as U,at as n,Mt as w,x};
