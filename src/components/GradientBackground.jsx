import { useRef,useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShaderGradientCanvas, ShaderGradient } from 'shadergradient';

gsap.registerPlugin(ScrollTrigger);

const GradientBackground = () => {
    const backgroundRef = useRef(null);
    const [settings] = useState({
        animate: 'on',
        axesHelper: 'off',
        bgColor1: '#ffffff',
        bgColor2: '#ffffff',
        brightness: 1.2,
        cAzimuthAngle: 180,
        cDistance: 2.9,
        cPolarAngle: 120,
        cameraZoom: 1,
        color1: '#ffffff',
        color2: '#203afe',
        color3: '#8e3394',
        embedMode: 'on',
        envPreset: 'city',
        format: 'gif',
        fov: 45,
        frameRate: 10,
        gizmoHelper: 'hide',
        grain: 'off',
        lightType: '3d',
        pixelDensity: 1,
        positionX: 0,
        positionY: 1.8,
        positionZ: 0,
        range: 'enabled',
        rangeEnd: 40,
        rangeStart: 0,
        reflection: 0.1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: -90,
        shader: 'defaults',
        toggleAxis: false,
        type: 'waterPlane',
        uDensity: 1,
        uFrequency: 5.5,
        uSpeed: 0.3,
        uStrength: 3,
        uTime: 0.2,
        wireframe: false,
    });

    const urlString = `https://www.shadergradient.co/customize?animate=${settings.animate}&axesHelper=${settings.axesHelper}&bgColor1=${encodeURIComponent(settings.bgColor1)}&bgColor2=${encodeURIComponent(settings.bgColor2)}&brightness=${settings.brightness}&cAzimuthAngle=${settings.cAzimuthAngle}&cDistance=${settings.cDistance}&cPolarAngle=${settings.cPolarAngle}&cameraZoom=${settings.cameraZoom}&color1=${encodeURIComponent(settings.color1)}&color2=${encodeURIComponent(settings.color2)}&color3=${encodeURIComponent(settings.color3)}&embedMode=${settings.embedMode}&envPreset=${settings.envPreset}&format=${settings.format}&fov=${settings.fov}&frameRate=${settings.frameRate}&gizmoHelper=${settings.gizmoHelper}&grain=${settings.grain}&lightType=${settings.lightType}&pixelDensity=${settings.pixelDensity}&positionX=${settings.positionX}&positionY=${settings.positionY}&positionZ=${settings.positionZ}&range=${settings.range}&rangeEnd=${settings.rangeEnd}&rangeStart=${settings.rangeStart}&reflection=${settings.reflection}&rotationX=${settings.rotationX}&rotationY=${settings.rotationY}&rotationZ=${settings.rotationZ}&shader=${settings.shader}&toggleAxis=${settings.toggleAxis}&type=${settings.type}&uDensity=${settings.uDensity}&uFrequency=${settings.uFrequency}&uSpeed=${settings.uSpeed}&uStrength=${settings.uStrength}&uTime=${settings.uTime}&wireframe=${settings.wireframe}`;

   
    return (
        <div ref={backgroundRef} className="absolute w-full h-full -z-10">
            <ShaderGradientCanvas style={{ width: '100%', height: '100%' }}>
                <ShaderGradient control="query" urlString={urlString} />
            </ShaderGradientCanvas>
        </div>
    );
};

export default GradientBackground;
